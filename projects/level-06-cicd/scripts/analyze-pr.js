const fs = require('fs');
const path = require('path');

// --- Argumentos ---
const args = process.argv.slice(2);
const diffIndex = args.indexOf('--diff');

const diffPath = diffIndex !== -1 ? args[diffIndex + 1] : null;

if (!diffPath) {
  console.error('Uso: node scripts/analyze-pr.js --diff <ruta-al-diff>');
  process.exit(1);
}

if (!fs.existsSync(diffPath)) {
  console.error(`Error: archivo no encontrado: ${diffPath}`);
  process.exit(1);
}

// --- Analizar diff ---
function analyzeDiff(diffContent) {
  const lines = diffContent.split('\n');
  const findings = [];
  const suggestions = [];

  let currentFile = '';
  let filesChanged = new Set();
  let linesAdded = 0;
  let linesRemoved = 0;

  // Para detección de archivos nuevos sin test
  const newFiles = [];
  const testFiles = new Set();

  // Para detección de funciones grandes
  let inFunction = false;
  let functionLines = 0;
  let functionStartLine = 0;
  let functionFile = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar archivo
    const fileMatch = line.match(/^diff --git a\/(.+?) b\/(.+?)$/);
    if (fileMatch) {
      currentFile = fileMatch[2];
      filesChanged.add(currentFile);

      // Detectar archivo nuevo
      if (line.includes('/dev/null')) {
        newFiles.push(currentFile);
      }

      // Resetear detección de funciones
      inFunction = false;
      functionLines = 0;
      functionFile = currentFile;
      continue;
    }

    // Contar líneas agregadas/eliminadas
    if (line.startsWith('+') && !line.startsWith('+++')) {
      linesAdded++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      linesRemoved++;
    }

    // Detectar archivos de test
    if (/\.(test|spec)\.(js|ts|jsx|tsx)$/.test(currentFile)) {
      testFiles.add(currentFile);
    }

    // Solo analizar líneas agregadas
    if (!line.startsWith('+') || line.startsWith('+++')) continue;

    const addedLine = line.substring(1);
    const lineNum = i + 1;

    // 1. Secrets hardcodeados
    const secretPatterns = [
      { type: 'password', regex: /(?:password|passwd|pwd)\s*[:=]\s*["'][^"'\s]{4,}["']/i },
      { type: 'api-key', regex: /(?:api[_-]?key|apikey|token|secret)\s*[:=]\s*["'][^"'\s]{8,}["']/i },
      { type: 'jwt', regex: /["']eyJ[a-zA-Z0-9_-]+\./ },
    ];

    for (const pattern of secretPatterns) {
      if (pattern.regex.test(addedLine)) {
        findings.push({
          file: currentFile,
          line: lineNum,
          type: 'secret',
          severity: 'high',
          description: `Posible ${pattern.type} hardcodeado`,
        });
      }
    }

    // 2. console.logs
    if (/console\.(log|debug|info)\s*\(/.test(addedLine)) {
      findings.push({
        file: currentFile,
        line: lineNum,
        type: 'console-log',
        severity: 'low',
        description: 'console.log agregado — posible debugging residual',
      });
    }

    // 3. Detección de funciones grandes (heurística)
    if (/function\s+\w+\s*\(|const\s+\w+\s*=\s*(?:async\s*)?\(/.test(addedLine)) {
      inFunction = true;
      functionLines = 0;
      functionStartLine = lineNum;
      functionFile = currentFile;
    }

    if (inFunction) {
      functionLines++;
      if (addedLine.includes('}') && functionLines > 50) {
        findings.push({
          file: functionFile,
          line: functionStartLine,
          type: 'large-function',
          severity: 'medium',
          description: `Función grande detectada: ${functionLines} líneas agregadas`,
        });
        inFunction = false;
      }
      if (addedLine.includes('}')) {
        inFunction = false;
      }
    }
  }

  // 4. Archivos nuevos sin test
  for (const file of newFiles) {
    if (/\.(js|ts|jsx|tsx)$/.test(file) && !file.includes('.test.') && !file.includes('.spec.')) {
      const baseName = path.basename(file, path.extname(file));
      const testFile = file.replace(baseName, baseName + '.test');
      if (!testFiles.has(testFile)) {
        findings.push({
          file,
          line: 1,
          type: 'missing-test',
          severity: 'medium',
          description: `Archivo nuevo sin test correspondiente: ${testFile}`,
        });
        suggestions.push(`Agregar tests para ${file} en ${testFile}`);
      }
    }
  }

  // 5. Cambios en package.json sin lockfile
  const hasPackageChange = Array.from(filesChanged).some((f) => f === 'package.json');
  const hasLockfileChange = Array.from(filesChanged).some((f) =>
    f === 'package-lock.json' || f === 'yarn.lock' || f === 'pnpm-lock.yaml'
  );

  if (hasPackageChange && !hasLockfileChange) {
    findings.push({
      file: 'package.json',
      line: 1,
      type: 'missing-lockfile',
      severity: 'medium',
      description: 'package.json modificado sin cambios en lockfile',
    });
    suggestions.push('Ejecutar npm install y commitear el package-lock.json actualizado');
  }

  return {
    summary: {
      filesChanged: filesChanged.size,
      linesAdded,
      linesRemoved,
    },
    findings,
    suggestions,
  };
}

// --- Main ---
function main() {
  const diffContent = fs.readFileSync(diffPath, 'utf-8');
  const result = analyzeDiff(diffContent);

  // --- Gate: bloquea si hay hallazgos de severidad high ---
  // Lo que bloquea el merge debe ser determinístico (ver docs/level-06-cicd.md).
  const gateMode = args.includes('--gate');
  if (gateMode) {
    const blocking = result.findings.filter((f) => f.severity === 'high');
    result.gate = {
      blocked: blocking.length > 0,
      reasons: blocking.map((f) => `${f.type}: ${f.description} (${f.file}:${f.line})`),
    };
  }

  // Output como JSON para que el workflow lo pueda parsear
  console.log(JSON.stringify(result, null, 2));

  // Salir con código no-cero si el gate bloquea
  if (gateMode && result.gate && result.gate.blocked) {
    process.exit(1);
  }
}

main();
