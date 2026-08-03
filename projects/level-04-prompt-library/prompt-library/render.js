const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, 'prompts');
const MAX_DEPTH = 10;

function resolveInclude(templatePath, content, variables, depth, visited) {
  if (depth > MAX_DEPTH) {
    throw new Error(`Include circular o demasiado profundo: ${templatePath}`);
  }

  const includeRegex = /\{\{include:([\w./-]+)\}\}/g;
  let match;
  let result = content;

  while ((match = includeRegex.exec(result)) !== null) {
    const includePath = match[1];
    const fullPath = path.join(PROMPTS_DIR, includePath + '.prompt.md');

    // Normalizar para detección de circularidad
    const normalized = path.normalize(includePath);
    if (visited.has(normalized)) {
      throw new Error(`Include circular detectado: ${normalized} ya está en la cadena de includes`);
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Template no encontrado: ${includePath} (buscando en ${fullPath})`);
    }

    const includeContent = fs.readFileSync(fullPath, 'utf-8');
    visited.add(normalized);

    const resolved = resolveInclude(includePath, includeContent, variables, depth + 1, visited);
    result = result.replace(match[0], resolved);

    visited.delete(normalized);
    includeRegex.lastIndex = 0;
  }

  return result;
}

function render(templateName, variables = {}) {
  const templatePath = path.join(PROMPTS_DIR, templateName + '.prompt.md');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template no encontrado: ${templateName}`);
  }

  let content = fs.readFileSync(templatePath, 'utf-8');

  // Resolver includes primero
  content = resolveInclude(templateName, content, variables, 0, new Set());

  // Reemplazar variables
  const varRegex = /\{\{(\w+)\}\}/g;
  let varMatch;
  const usedVars = new Set();

  while ((varMatch = varRegex.exec(content)) !== null) {
    const varName = varMatch[1];
    usedVars.add(varName);

    if (variables[varName] === undefined) {
      throw new Error(`Variable requerida no proporcionada: ${varName}`);
    }

    content = content.replace(varMatch[0], variables[varName]);
    varRegex.lastIndex = 0;
  }

  return content;
}

function listTemplates(category) {
  const categories = fs.readdirSync(PROMPTS_DIR, { withFileTypes: true });
  const result = [];

  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    if (category && cat.name !== category) continue;

    const files = fs.readdirSync(path.join(PROMPTS_DIR, cat.name));
    const templates = files
      .filter((f) => f.endsWith('.prompt.md'))
      .map((f) => f.replace('.prompt.md', ''));

    result.push({ category: cat.name, templates });
  }

  return result;
}

function showTemplate(templateName) {
  const templatePath = path.join(PROMPTS_DIR, templateName + '.prompt.md');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template no encontrado: ${templateName}`);
  }

  let content = fs.readFileSync(templatePath, 'utf-8');

  // Resolver includes para mostrar el template completo
  content = resolveInclude(templateName, content, {}, 0, new Set());

  return content;
}

module.exports = { render, listTemplates, showTemplate };
