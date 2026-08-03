const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  { type: 'password', regex: /(?:password|passwd|pwd)\s*[:=]\s*["']([^"'\s]{4,})["']/gi },
  { type: 'api-key', regex: /(?:api[_-]?key|apikey|api_key)\s*[:=]\s*["']([^"'\s]{8,})["']/gi },
  { type: 'api-key', regex: /(?:token|access_token|auth_token)\s*[:=]\s*["']([^"'\s]{8,})["']/gi },
  { type: 'api-key', regex: /(?:secret|client_secret|app_secret)\s*[:=]\s*["']([^"'\s]{8,})["']/gi },
  { type: 'jwt-token', regex: /["'](eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)["']/g },
  { type: 'private-key', regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g },
  { type: 'url-credentials', regex: /https?:\/\/[^:]+:[^@]+@/g },
];

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);
const PLACEHOLDER_PATTERNS = [
  /your[-_]?(?:password|key|secret|token)[-_]?here/i,
  /change[-_]?me/i,
  /placeholder/i,
  /example/i,
  /xxxxx/i,
  /<secret>/i,
  /\$\{.*\}/,
  /process\.env\./,
];

function isPlaceholder(value) {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const { type, regex } of SECRET_PATTERNS) {
      regex.lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        const value = match[1] || match[0];

        if (isPlaceholder(value)) continue;

        findings.push({
          file: filePath,
          line: i + 1,
          type,
          secret: value.substring(0, 40) + (value.length > 40 ? '...' : ''),
          context: line.trim().substring(0, 120),
        });
      }
    }
  }

  return findings;
}

function walkDir(dirPath) {
  const findings = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORE_DIRS.has(entry.name)) {
          findings.push(...walkDir(fullPath));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.js', '.ts', '.jsx', '.tsx', '.env', '.json', '.yaml', '.yml'].includes(ext)) {
          try {
            findings.push(...scanFile(fullPath));
          } catch {
            // skip unreadable files
          }
        }
      }
    }
  } catch {
    // skip unreadable dirs
  }

  return findings;
}

function scan(projectRoot) {
  return walkDir(projectRoot);
}

module.exports = { scan };
