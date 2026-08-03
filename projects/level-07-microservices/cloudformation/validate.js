#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// --- Argumentos ---
const args = process.argv.slice(2);
const templateIndex = args.indexOf('--template');
const templatePath = templateIndex !== -1 ? args[templateIndex + 1] : 'cloudformation/template.yml';

if (!fs.existsSync(templatePath)) {
  console.error(`Error: template no encontrado: ${templatePath}`);
  process.exit(1);
}

const content = fs.readFileSync(templatePath, 'utf-8');
const findings = [];

// --- Mini parser YAML (solo lo que necesitamos) ---
function extractBlocks(yaml) {
  const blocks = {};
  const lines = yaml.split('\n');
  let currentKey = null;

  for (const line of lines) {
    const indent = line.match(/^\s*/)[0].length;

    // Top-level resource (2 spaces or 0)
    if (indent === 0 && line.trim() && !line.trim().startsWith('-')) {
      currentKey = line.trim().replace(':', '').trim();
      blocks[currentKey] = [];
    } else if (currentKey && indent > 0) {
      blocks[currentKey].push(line.trim());
    }
  }

  return blocks;
}

function findKeyInLines(lines, key) {
  return lines.some((l) => l.startsWith(key + ':') || l.includes(key + ':'));
}

function getValueAfter(lines, key) {
  const line = lines.find((l) => l.startsWith(key + ':'));
  if (!line) return null;
  const val = line.substring(key.length + 1).trim();
  return val;
}

// --- Especificación esperada ---
const EXPECTED = {
  services: {
    'users-service': { port: 3001, path: '/users*' },
    'orders-service': { port: 3002, path: '/orders*' },
  },
  healthPath: '/health',
  albPort: 80,
};

const blocks = extractBlocks(content);
const resources = blocks.Resources || [];

// Extraer task definitions y sus puertos
function findTaskDefinitions(resourceLines) {
  const tasks = {};
  // Buscar bloques Family y ContainerPort
  const familyMatch = resourceLines.join('\n').matchAll(/Family:\s*!Sub\s*'([\w-]+)-/g);
  for (const m of familyMatch) {
    const name = m[1];
    const portMatch = resourceLines.join('\n').match(new RegExp(name + '[\\s\\S]*?ContainerPort:\\s*(\\d+)'));
    if (portMatch) {
      tasks[name] = { port: parseInt(portMatch[1], 10) };
    }
  }
  return tasks;
}

// --- Validaciones ---

// 1. Task definitions exist
const hasUsersTask = /UsersTaskDefinition/.test(content);
const hasOrdersTask = /OrdersTaskDefinition/.test(content);

if (!hasUsersTask) {
  findings.push({ type: 'missing-task-definition', severity: 'critical', message: 'Falta UsersTaskDefinition' });
} else {
  // Verificar puerto del container
  const usersPortMatch = content.match(/UsersTaskDefinition[\s\S]*?ContainerPort:\s*(\d+)/);
  if (usersPortMatch && parseInt(usersPortMatch[1], 10) !== 3001) {
    findings.push({ type: 'port-mismatch', severity: 'critical', message: `UsersTaskDefinition usa puerto ${usersPortMatch[1]}, esperado 3001` });
  }
}

if (!hasOrdersTask) {
  findings.push({ type: 'missing-task-definition', severity: 'critical', message: 'Falta OrdersTaskDefinition' });
} else {
  const ordersPortMatch = content.match(/OrdersTaskDefinition[\s\S]*?ContainerPort:\s*(\d+)/);
  if (ordersPortMatch && parseInt(ordersPortMatch[1], 10) !== 3002) {
    findings.push({ type: 'port-mismatch', severity: 'critical', message: `OrdersTaskDefinition usa puerto ${ordersPortMatch[1]}, esperado 3002` });
  }
}

// 2. Target groups y health checks
const hasUsersTG = /UsersTargetGroup/.test(content);
const hasOrdersTG = /OrdersTargetGroup/.test(content);

if (!hasUsersTG) {
  findings.push({ type: 'missing-target-group', severity: 'critical', message: 'Falta UsersTargetGroup' });
} else {
  const tgHealth = content.match(/UsersTargetGroup[\s\S]*?HealthCheckPath:\s*([\w/]+)/);
  if (!tgHealth || tgHealth[1] !== '/health') {
    findings.push({ type: 'missing-health-check', severity: 'high', message: 'UsersTargetGroup no tiene HealthCheckPath: /health' });
  }
}

if (!hasOrdersTG) {
  findings.push({ type: 'missing-target-group', severity: 'critical', message: 'Falta OrdersTargetGroup' });
} else {
  const tgHealth = content.match(/OrdersTargetGroup[\s\S]*?HealthCheckPath:\s*([\w/]+)/);
  if (!tgHealth || tgHealth[1] !== '/health') {
    findings.push({ type: 'missing-health-check', severity: 'high', message: 'OrdersTargetGroup no tiene HealthCheckPath: /health' });
  }
}

// 3. ALB listener en 80
const listenerMatch = content.match(/Listener:[\s\S]*?Port:\s*(\d+)/);
if (!listenerMatch) {
  findings.push({ type: 'missing-listener', severity: 'critical', message: 'Falta Listener' });
} else if (parseInt(listenerMatch[1], 10) !== 80) {
  findings.push({ type: 'missing-listener', severity: 'high', message: `Listener en puerto ${listenerMatch[1]}, esperado 80` });
}

// 4. Security groups expuestos
// ServiceSecurityGroup abre 3001 y 3002 a 0.0.0.0/0 — eso es un problema (debería ser solo desde el ALB)
// Nota: extraemos el bloque por indentación en vez de regex con lookahead, que es frágil
// cuando el SecurityGroupIngress está al final del archivo.
function extractResourceBlock(yaml, resourceName) {
  const lines = yaml.split('\n');
  const start = lines.findIndex((l) => l.trim().startsWith(`${resourceName}:`));
  if (start === -1) return [];
  const startIndent = lines[start].match(/^\s*/)[0].length;
  const result = [lines[start]];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const indent = line.match(/^\s*/)[0].length;
    if (indent <= startIndent) break;
    result.push(line);
  }
  return result;
}

const serviceSGLines = extractResourceBlock(content, 'ServiceSecurityGroup');
const sgBody = serviceSGLines.join('\n');
const fromPorts = [...sgBody.matchAll(/FromPort:\s*(\d+)/g)].map((m) => parseInt(m[1], 10));
const allOpen = [...sgBody.matchAll(/CidrIp:\s*([\d.]+\/\d+)/g)].map((m) => m[1]);

// Solo reportar si HAY al menos un CidrIp y todos son 0.0.0.0/0.
// (Si usa SourceSecurityGroupId, allOpen queda vacío y NO es un puerto expuesto.)
const exposed = allOpen.length > 0 && allOpen.every((cidr) => cidr === '0.0.0.0/0');
for (const port of fromPorts) {
  if (exposed) {
    findings.push({
      type: 'exposed-port',
      severity: 'high',
      message: `ServiceSecurityGroup expone puerto ${port} a 0.0.0.0/0 — debería restringirse al ALB`,
    });
  }
}

// 5. Listener rules para rutas
const hasUsersRule = /UsersListenerRule/.test(content) && content.includes('/users*');
const hasOrdersRule = /OrdersListenerRule/.test(content) && content.includes('/orders*');

if (!hasUsersRule) {
  findings.push({ type: 'missing-listener-rule', severity: 'high', message: 'Falta UsersListenerRule para /users*' });
}
if (!hasOrdersRule) {
  findings.push({ type: 'missing-listener-rule', severity: 'high', message: 'Falta OrdersListenerRule para /orders*' });
}

// --- Reporte ---
const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
const sorted = findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

const criticalCount = sorted.filter((f) => f.severity === 'critical').length;
const highCount = sorted.filter((f) => f.severity === 'high').length;
const mediumCount = sorted.filter((f) => f.severity === 'medium').length;

const icon = (s) => ({ critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }[s] || '⚪');

console.log('=== Validación de CloudFormation Template ===\n');

if (sorted.length === 0) {
  console.log('✅ Template válido — no se detectaron problemas.');
  process.exit(0);
}

for (const f of sorted) {
  console.log(`${icon(f.severity)} [${f.severity.toUpperCase()}] [${f.type}] ${f.message}`);
}

console.log(`\nResumen: ${criticalCount} críticos, ${highCount} altos, ${mediumCount} medios`);

if (criticalCount > 0) {
  console.log('\n❌ Exit code 1: hay hallazgos críticos que impiden el deploy.');
  process.exit(1);
} else if (highCount > 0) {
  console.log('\n⚠️ Exit code 0 pero con advertencias: revisar antes de deployar.');
  process.exit(0);
} else {
  console.log('\n✅ Exit code 0: template válido.');
  process.exit(0);
}
