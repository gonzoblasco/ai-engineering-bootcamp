const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Argumentos ---
const args = process.argv.slice(2);
const fromIndex = args.indexOf('--from');
const toIndex = args.indexOf('--to');

const from = fromIndex !== -1 ? args[fromIndex + 1] : null;
const to = toIndex !== -1 ? args[toIndex + 1] : 'HEAD';

// --- Obtener tags ---
function getTags() {
  const output = execSync('git tag --sort=-creatordate', { encoding: 'utf-8' });
  return output.split('\n').filter(Boolean);
}

function getFirstCommit() {
  return execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf-8' }).trim();
}

// --- Obtener log entre dos referencias ---
function getLog(fromRef, toRef) {
  try {
    const cmd = `git log --oneline --format='%s||%h||%an' ${fromRef}..${toRef}`;
    return execSync(cmd, { encoding: 'utf-8' }).split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

// --- Clasificar commit ---
function classifyCommit(message) {
  const trimmed = message.trim();

  if (trimmed.includes('BREAKING CHANGE') || /!:\s/.test(trimmed) || /!\s/.test(trimmed)) {
    return 'breaking';
  }

  const match = trimmed.match(/^(\w+)(\([^)]+\))?!?:\s/);
  if (!match) return 'other';

  const type = match[1];

  const categories = {
    'feat': 'features',
    'feature': 'features',
    'fix': 'fixes',
    'bugfix': 'fixes',
    'hotfix': 'fixes',
    'chore': 'chores',
    'ci': 'chores',
    'refactor': 'chores',
    'style': 'chores',
    'test': 'chores',
    'tests': 'chores',
    'docs': 'chores',
    'doc': 'chores',
    'perf': 'chores',
    'performance': 'chores',
    'build': 'chores',
    'revert': 'chores',
  };

  return categories[type] || 'other';
}

// --- Generar release notes ---
function generate(fromRef, toRef) {
  const logs = getLog(fromRef, toRef);
  const version = toRef.startsWith('v') ? toRef : toRef;
  const date = new Date().toISOString().split('T')[0];

  const grouped = {
    features: [],
    fixes: [],
    chores: [],
    breaking: [],
    other: [],
  };

  for (const log of logs) {
    const parts = log.split('||');
    const message = parts[0] || '';
    const hash = parts[1] || '';
    const author = parts[2] || 'unknown';
    const category = classifyCommit(message);

    // Limpiar el mensaje para mostrarlo
    const cleanMessage = message.replace(/^(\w+)(\([^)]+\))?!?:\s/, '').trim();

    grouped[category].push({ message: cleanMessage || message, hash, author });
  }

  // Generar markdown
  let md = `# Changelog\n\n## [${version}] - ${date}\n\n`;

  if (grouped.breaking.length > 0) {
    md += '### ⚠️ Breaking Changes\n\n';
    for (const c of grouped.breaking) {
      md += `- ${c.message} (${c.hash}, ${c.author})\n`;
    }
    md += '\n';
  }

  if (grouped.features.length > 0) {
    md += '### 🚀 Features\n\n';
    for (const c of grouped.features) {
      md += `- ${c.message} (${c.hash}, ${c.author})\n`;
    }
    md += '\n';
  }

  if (grouped.fixes.length > 0) {
    md += '### 🐛 Fixes\n\n';
    for (const c of grouped.fixes) {
      md += `- ${c.message} (${c.hash}, ${c.author})\n`;
    }
    md += '\n';
  }

  if (grouped.chores.length > 0) {
    md += '### 🔧 Chores\n\n';
    for (const c of grouped.chores) {
      md += `- ${c.message} (${c.hash}, ${c.author})\n`;
    }
    md += '\n';
  }

  if (grouped.other.length > 0) {
    md += '### 📦 Otros\n\n';
    for (const c of grouped.other) {
      md += `- ${c.message} (${c.hash}, ${c.author})\n`;
    }
    md += '\n';
  }

  if (logs.length === 0) {
    md += '*No hay cambios nuevos.*\n';
  }

  return md;
}

// --- Main ---
function main() {
  const tags = getTags();
  let fromRef = from;
  let toRef = to;

  // Si no se especificó from, usar el tag anterior
  if (!fromRef) {
    if (tags.length >= 2) {
      fromRef = tags[1]; // el tag anterior al más reciente
    } else if (tags.length === 1) {
      fromRef = getFirstCommit();
    } else {
      fromRef = getFirstCommit();
    }
  }

  // Si to es HEAD y hay tags, usar el último tag
  if (toRef === 'HEAD' && tags.length > 0) {
    toRef = tags[0];
  }

  console.log(`Generando release notes de ${fromRef} a ${toRef}...`);

  const notes = generate(fromRef, toRef);

  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  fs.writeFileSync(changelogPath, notes, 'utf-8');
  console.log(`✅ CHANGELOG.md generado: ${changelogPath}`);
  console.log('');
  console.log(notes);
}

main();
