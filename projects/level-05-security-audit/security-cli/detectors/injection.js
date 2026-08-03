const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);

// SQL injection patterns
const SQL_PATTERNS = [
  {
    type: 'sql-injection',
    risk: 'high',
    regex: /(?:db|pool|client|connection|query|execute|run)\s*\.\s*(?:query|execute|run|all|get)\s*\(\s*["'`]\s*SELECT/i,
  },
  {
    type: 'sql-injection',
    risk: 'high',
    regex: /["'`]\s*SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*['"`]\s*\+/i,
  },
  {
    type: 'sql-injection',
    risk: 'high',
    regex: /`\s*SELECT\s+.*\$\{/i,
  },
  {
    type: 'sql-injection',
    risk: 'high',
    regex: /["'`]\s*INSERT\s+INTO\s+.*['"`]\s*\+/i,
  },
  {
    type: 'sql-injection',
    risk: 'high',
    regex: /["'`]\s*DELETE\s+FROM\s+.*['"`]\s*\+/i,
  },
  {
    type: 'sql-injection',
    risk: 'medium',
    regex: /\.exec(?:SQL|ute)?\s*\(\s*["'`].*\+/i,
  },
];

// XSS patterns
const XSS_PATTERNS = [
  {
    type: 'xss',
    risk: 'high',
    regex: /\.innerHTML\s*=/,
  },
  {
    type: 'xss',
    risk: 'high',
    regex: /\.outerHTML\s*=/,
  },
  {
    type: 'xss',
    risk: 'high',
    regex: /\.insertAdjacentHTML\s*\(/,
  },
  {
    type: 'xss',
    risk: 'high',
    regex: /dangerouslySetInnerHTML/,
  },
  {
    type: 'xss',
    risk: 'high',
    regex: /document\.write\s*\(/,
  },
  {
    type: 'xss',
    risk: 'medium',
    regex: /\.html\s*\(\s*[^)]*\$/,
  },
  {
    type: 'xss',
    risk: 'medium',
    regex: /v-html\s*=/,
  },
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const pattern of [...SQL_PATTERNS, ...XSS_PATTERNS]) {
      pattern.regex.lastIndex = 0;
      if (pattern.regex.test(line)) {
        findings.push({
          file: filePath,
          line: i + 1,
          type: pattern.type,
          risk: pattern.risk,
          snippet: line.trim().substring(0, 80),
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
        if (['.js', '.ts', '.jsx', '.tsx', '.vue'].includes(ext)) {
          try {
            findings.push(...scanFile(fullPath));
          } catch {
            // skip unreadable
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
