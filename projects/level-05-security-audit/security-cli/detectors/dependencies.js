const fs = require('fs');
const path = require('path');

// Simulated CVE database
const VULNERABLE_PACKAGES = [
  { name: 'express', vulnerable: '<4.18.0', cve: 'CVE-2022-24999', severity: 'high', description: 'Open Redirect' },
  { name: 'lodash', vulnerable: '<4.17.21', cve: 'CVE-2021-23337', severity: 'high', description: 'Prototype Pollution' },
  { name: 'axios', vulnerable: '<0.21.2', cve: 'CVE-2021-3749', severity: 'medium', description: 'SSRF' },
  { name: 'json5', vulnerable: '<2.2.2', cve: 'CVE-2022-46175', severity: 'high', description: 'Prototype Pollution' },
  { name: 'minimist', vulnerable: '<1.2.6', cve: 'CVE-2021-44906', severity: 'medium', description: 'Prototype Pollution' },
  { name: 'node-fetch', vulnerable: '<2.6.7', cve: 'CVE-2022-0235', severity: 'medium', description: 'URL Injection' },
  { name: 'shelljs', vulnerable: '<0.8.5', cve: 'CVE-2022-0144', severity: 'high', description: 'Command Injection' },
  { name: 'follow-redirects', vulnerable: '<1.14.8', cve: 'CVE-2022-0536', severity: 'medium', description: 'Credentials Leak' },
  { name: 'qs', vulnerable: '<6.7.3', cve: 'CVE-2022-24999', severity: 'medium', description: 'Prototype Pollution' },
  { name: 'ejs', vulnerable: '<3.1.7', cve: 'CVE-2022-29078', severity: 'high', description: 'RCE' },
];

function parseVersion(versionStr) {
  // Remove ^ ~ >= <= > < prefixes
  return versionStr.replace(/^[\^~><=]+/, '');
}

function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA !== numB) return numA - numB;
  }

  return 0;
}

function isVulnerable(installed, vulnerableRange) {
  const installedClean = parseVersion(installed);
  const rangeClean = vulnerableRange.replace(/^</, '');

  // Handle <X.Y.Z
  if (vulnerableRange.startsWith('<')) {
    return compareVersions(installedClean, rangeClean) < 0;
  }

  // Handle <=X.Y.Z
  if (vulnerableRange.startsWith('<=')) {
    return compareVersions(installedClean, rangeClean) <= 0;
  }

  return false;
}

function scan(projectRoot) {
  const findings = [];
  const pkgPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return findings;
  }

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  } catch {
    return findings;
  }

  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  for (const [name, version] of Object.entries(allDeps)) {
    // Skip workspace protocols and file: dependencies
    if (version.startsWith('workspace:') || version.startsWith('file:') || version.startsWith('link:')) continue;

    for (const vuln of VULNERABLE_PACKAGES) {
      if (vuln.name === name && isVulnerable(version, vuln.vulnerable)) {
        findings.push({
          package: name,
          installed: version,
          vulnerable: vuln.vulnerable,
          cve: vuln.cve,
          severity: vuln.severity,
          description: vuln.description,
          fixedIn: vuln.vulnerable.replace('<', '>='),
        });
      }
    }
  }

  return findings;
}

module.exports = { scan };
