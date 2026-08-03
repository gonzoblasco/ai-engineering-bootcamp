#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { validate, loadStandards } = require('./standards/validate');

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, 'dashboard');

function generate() {
  const standards = loadStandards(projectRoot);
  const result = validate(projectRoot, standards);

  // Agregar info de servicios para el dashboard
  const services = standards.services.required.map((name) => {
    const indexPath = path.join(projectRoot, name, 'index.js');
    const readmePath = path.join(projectRoot, name, 'README.md');
    const hasHealth = fs.existsSync(indexPath)
      && (fs.readFileSync(indexPath, 'utf-8').includes("'/health'") || fs.readFileSync(indexPath, 'utf-8').includes('"/health"'));
    const lines = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8').split('\n').length : 0;

    return {
      name,
      hasIndex: fs.existsSync(indexPath),
      hasHealth,
      hasReadme: fs.existsSync(readmePath),
      lines,
      status: (fs.existsSync(indexPath) && hasHealth) ? 'healthy' : 'warning',
    };
  });

  const data = {
    generatedAt: new Date().toISOString(),
    project: 'level-07-microservices',
    score: result.score,
    scoreLabel: result.score >= 80 ? 'green' : result.score >= 60 ? 'yellow' : 'red',
    checks: result.checks.map((c) => ({
      name: c.name,
      status: c.status,
      details: c.details,
    })),
    violations: result.violations,
    services,
  };

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✅ Dashboard data generado: ${outputPath}`);
  console.log(`Score: ${data.score}/100`);
  console.log(`Checks: ${data.checks.map((c) => `${c.name}=${c.status}`).join(', ')}`);
  console.log(`Violaciones: ${data.violations.length}`);
  console.log(`Servicios: ${services.map((s) => `${s.name}=${s.status}`).join(', ')}`);
}

generate();
