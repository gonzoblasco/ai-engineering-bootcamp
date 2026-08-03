#!/usr/bin/env node

const { render, listTemplates, showTemplate } = require('./render');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Uso: prompt-library <comando> [opciones]');
  console.log('');
  console.log('Comandos:');
  console.log('  list [--category <cat>]    Lista templates disponibles');
  console.log('  show <template>             Muestra template con includes resueltos');
  console.log('  render <template> [opciones]  Renderiza template con variables');
  console.log('');
  console.log('Opciones de render:');
  console.log('  --var <key>=<value>         Variable para el template (repetible)');
  console.log('  --copy                      Copia al clipboard (requiere pbcopy)');
  process.exit(0);
}

switch (command) {
  case 'list': {
    const catIndex = args.indexOf('--category');
    const category = catIndex !== -1 ? args[catIndex + 1] : null;
    const result = listTemplates(category);

    if (result.length === 0) {
      console.log('No se encontraron templates.');
      process.exit(0);
    }

    for (const { category: cat, templates } of result) {
      console.log(`\n${cat}/`);
      for (const t of templates) {
        console.log(`  ${t}`);
      }
    }
    console.log();
    break;
  }

  case 'show': {
    const templateName = args[1];
    if (!templateName) {
      console.error('Error: especificá un template (ej: workflows/review-code)');
      process.exit(1);
    }

    try {
      const content = showTemplate(templateName);
      console.log(content);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    break;
  }

  case 'render': {
    const templateName = args[1];
    if (!templateName) {
      console.error('Error: especificá un template (ej: workflows/review-code)');
      process.exit(1);
    }

    const variables = {};
    const varPairs = args.filter((a) => a.startsWith('--var='));
    for (const pair of varPairs) {
      const eqIndex = pair.indexOf('=');
      const key = pair.substring(6, eqIndex);
      const value = pair.substring(eqIndex + 1);
      variables[key] = value;
    }

    // También soportar --var key=value (separado)
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--var' && args[i + 1]) {
        const eqIndex = args[i + 1].indexOf('=');
        if (eqIndex !== -1) {
          const key = args[i + 1].substring(0, eqIndex);
          const value = args[i + 1].substring(eqIndex + 1);
          variables[key] = value;
        }
        i++;
      }
    }

    try {
      const result = render(templateName, variables);

      if (args.includes('--copy')) {
        const proc = require('child_process');
        const child = proc.spawn('pbcopy');
        child.stdin.write(result);
        child.stdin.end();
        console.log('✅ Copiado al clipboard');
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    break;
  }

  default:
    console.error(`Comando desconocido: ${command}`);
    console.log('Usá: prompt-library list|show|render');
    process.exit(1);
}
