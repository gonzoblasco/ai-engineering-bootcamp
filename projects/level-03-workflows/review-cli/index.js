#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// --- Argumentos ---
const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const outputIndex = args.indexOf('--output');
const useAI = args.includes('--ai');

if (fileIndex === -1 || !args[fileIndex + 1]) {
  console.error('Uso: node index.js --file <ruta> [--output <ruta>] [--ai]');
  process.exit(1);
}

const filePath = path.resolve(args[fileIndex + 1]);
const outputPath = outputIndex !== -1 && args[outputIndex + 1]
  ? path.resolve(args[outputIndex + 1])
  : path.resolve('review.md');

// --- Lectura ---
if (!fs.existsSync(filePath)) {
  console.error(`Error: archivo no encontrado: ${filePath}`);
  process.exit(1);
}

const source = fs.readFileSync(filePath, 'utf-8');
const lines = source.split('\n');
const fileName = path.basename(filePath);

// --- Análisis básico ---
const totalLines = lines.length;
const codeLines = lines.filter((l) => l.trim().length > 0 && !l.trim().startsWith('//') && !l.trim().startsWith('*')).length;
const commentLines = lines.filter((l) => l.trim().startsWith('//') || l.trim().startsWith('*') || l.trim().startsWith('/*')).length;
const blankLines = lines.filter((l) => l.trim().length === 0).length;

// Funciones
const funcRegex = /(?:function\s+\w+|const\s+\w+\s*=\s*(?:async\s*)?\(|\(\s*\)\s*=>|=>\s*{)/g;
const funcMatches = source.match(funcRegex) || [];
const totalFunctions = funcMatches.length;

// console.logs
const consoleLogRegex = /console\.(log|warn|error|info|debug)\s*\(/g;
const consoleLogMatches = source.match(consoleLogRegex) || [];

// Líneas largas
const longLines = lines
  .map((l, i) => ({ line: i + 1, length: l.length, text: l.trim() }))
  .filter((l) => l.length > 80);

// Funciones largas (heurística: líneas entre { y } )
function findLongFunctions(src) {
  const results = [];
  const fnRegex = /(?:function\s+\w+|const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*(?::\s*\w+\s*)?=>)\s*{/g;
  let match;
  while ((match = fnRegex.exec(src)) !== null) {
    const startLine = src.substring(0, match.index).split('\n').length;
    let depth = 1;
    let pos = match.index + match[0].length;
    while (pos < src.length && depth > 0) {
      if (src[pos] === '{') depth++;
      if (src[pos] === '}') depth--;
      pos++;
    }
    const endLine = src.substring(0, pos).split('\n').length;
    const fnLines = endLine - startLine + 1;
    if (fnLines > 30) {
      const fnName = match[0].replace(/^(function|const)\s+/, '').replace(/\s*=.*/, '').trim();
      results.push({ name: fnName || '(anonymous)', startLine, lines: fnLines });
    }
  }
  return results;
}

const longFunctions = findLongFunctions(source);

// --- Análisis con IA (reglas locales) ---
const aiFindings = [];

if (useAI) {
  // Anidación profunda
  const linesArr = lines;
  for (let i = 0; i < linesArr.length; i++) {
    const line = linesArr[i];
    const indentLevel = (line.match(/^\s*/) || [''])[0].length;
    if (indentLevel >= 24) {
      const nextLine = linesArr[i + 1] || '';
      if (nextLine.trim() && (nextLine.match(/^\s*/) || [''])[0].length >= indentLevel) {
        aiFindings.push({
          line: i + 1,
          severity: 'media',
          description: `Anidación profunda (${Math.floor(indentLevel / 2)} niveles estimados)`,
          suggestion: 'Extraer lógica a funciones más pequeñas para mejorar legibilidad',
        });
      }
    }
  }

  // Variables cortas
  const varRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
  let varMatch;
  while ((varMatch = varRegex.exec(source)) !== null) {
    const name = varMatch[1];
    if (name.length <= 2 && !['i', 'j', 'k'].includes(name)) {
      const lineNum = source.substring(0, varMatch.index).split('\n').length;
      aiFindings.push({
        line: lineNum,
        severity: 'baja',
        description: `Nombre de variable poco descriptivo: "${name}" (${name.length} caracteres)`,
        suggestion: `Usar un nombre que describa el propósito, ej: index, counter, tempValue`,
      });
    }
  }

  // Operaciones sin try/catch
  const riskyOps = ['JSON.parse', 'fetch(', 'readFile', 'writeFile', 'JSON.stringify'];
  for (const op of riskyOps) {
    let idx = 0;
    while ((idx = source.indexOf(op, idx)) !== -1) {
      const lineNum = source.substring(0, idx).split('\n').length;
      const beforeOp = source.substring(Math.max(0, idx - 200), idx);
      const hasTry = /try\s*{/.test(beforeOp);
      if (!hasTry) {
        aiFindings.push({
          line: lineNum,
          severity: 'alta',
          description: `Operación riesgosa sin try/catch: ${op}`,
          suggestion: 'Envolver en bloque try/catch para manejar errores gracefulmente',
        });
      }
      idx += op.length;
    }
  }

  // Código comentado (3+ líneas consecutivas)
  let commentedBlock = 0;
  let blockStart = 0;
  for (let i = 0; i < linesArr.length; i++) {
    const trimmed = linesArr[i].trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed === '' || trimmed.startsWith('/*')) {
      if (commentedBlock === 0) blockStart = i + 1;
      commentedBlock++;
    } else {
      if (commentedBlock >= 3) {
        aiFindings.push({
          line: blockStart,
          severity: 'media',
          description: `Bloque de código comentado (${commentedBlock} líneas consecutivas)`,
          suggestion: 'Eliminar código muerto o agregar un TODO con la razón del comentario',
        });
      }
      commentedBlock = 0;
    }
  }
  // Check al final
  if (commentedBlock >= 3) {
    aiFindings.push({
      line: blockStart,
      severity: 'media',
      description: `Bloque de código comentado (${commentedBlock} líneas consecutivas)`,
      suggestion: 'Eliminar código muerto o agregar un TODO con la razón del comentario',
    });
  }
}

// --- Generar reporte ---
const severityOrder = { alta: 0, media: 1, baja: 2 };
const sortedFindings = [...aiFindings].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

const report = `# Code Review: ${fileName}

## Resumen

- **Archivo:** ${fileName}
- **Líneas totales:** ${totalLines}
- **Líneas de código:** ${codeLines}
- **Líneas de comentarios:** ${commentLines}
- **Líneas en blanco:** ${blankLines}
- **Funciones declaradas:** ${totalFunctions}
- **console.logs encontrados:** ${consoleLogMatches.length}
${useAI ? `- **Hallazgos con IA:** ${sortedFindings.length}` : ''}

## Métricas

| Métrica | Valor |
|---------|-------|
| Líneas totales | ${totalLines} |
| Líneas de código | ${codeLines} |
| Comentarios | ${commentLines} |
| Líneas en blanco | ${blankLines} |
| Funciones | ${totalFunctions} |
| console.logs | ${consoleLogMatches.length} |
| Líneas > 80 caracteres | ${longLines.length} |
| Funciones > 30 líneas | ${longFunctions.length} |

## Advertencias

### Líneas largas (> 80 caracteres)
${longLines.length === 0 ? '- Ninguna detectada.' : longLines.map((l) => `- Línea ${l.line}: ${l.length} caracteres — \`${l.text.substring(0, 60)}...\``).join('\n')}

### Funciones largas (> 30 líneas)
${longFunctions.length === 0 ? '- Ninguna detectada.' : longFunctions.map((f) => `- Línea ${f.startLine}: "${f.name}" — ${f.lines} líneas`).join('\n')}

### console.logs en código
${consoleLogMatches.length === 0 ? '- Ninguno detectado.' : `- ${consoleLogMatches.length} console.log(s) encontrados. Revisar si son debugging residual.`}

${useAI ? `## Análisis con IA

${sortedFindings.length === 0 ? 'No se detectaron problemas adicionales.' : `| Línea | Severidad | Descripción | Sugerencia |
|-------|-----------|-------------|------------|
${sortedFindings.map((f) => `| ${f.line} | ${f.severidad(f.severity)} | ${f.description} | ${f.suggestion} |`).join('\n')}

### Puntaje general

${(() => {
  const high = sortedFindings.filter((f) => f.severity === 'alta').length;
  const med = sortedFindings.filter((f) => f.severity === 'media').length;
  const low = sortedFindings.filter((f) => f.severity === 'baja').length;
  const score = Math.max(1, 10 - high * 3 - med * 1.5 - low * 0.5);
  return `**${score.toFixed(1)} / 10**`;
})()}
` : ''}

---

*Reporte generado el ${new Date().toISOString().split('T')[0]} por review-cli*
`;

fs.writeFileSync(outputPath, report, 'utf-8');
console.log(`✅ Reporte generado: ${outputPath}`);

// Helper para emojis de severidad
function severidad(s) {
  const map = { alta: '🔴 Alta', media: '🟡 Media', baja: '🟢 Baja' };
  return map[s] || s;
}
