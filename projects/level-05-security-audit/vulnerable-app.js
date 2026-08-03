// Vulnerable Express app for the Level 5 Exploit Lab (Exercise 6).
// DELIBERATELY vulnerable — for local learning only. Do not ship.
//
// Contains: SQL injection in a search endpoint + a hardcoded secret.
// Run: node vulnerable-app.js  (listens on :3999)

const express = require('express');
const app = express();
app.use(express.json());

// In-memory "DB" — but queried with string concatenation (the vuln).
const todos = [
  { id: 1, title: 'Learn SQLi basics', user: 'alice' },
  { id: 2, title: 'Deploy the release', user: 'bob' },
  { id: 3, title: 'Refactor auth module', user: 'carol' },
  { id: 4, title: 'Write documentation', user: 'dave' },
  { id: 5, title: 'Secret admin note — salaries', user: 'admin' },
];

// HARDCODED SECRET (intentional — the detectors should flag this)
const API_SECRET = 'sk-live-7f3a9c2b11e0d45f8a1b6c7d9e0f2a3b';

function fakeQuery(where) {
  // Simulates a string-concatenated SQL query: the raw input is embedded
  // directly. A payload like  ' OR '1'='1  becomes:
  //   SELECT * FROM todos WHERE title LIKE '%' OR '1'='1%'
  // which is ALWAYS true -> returns ALL rows (the injection).
  const lower = where.toLowerCase();
  if (/or\s+'1'\s*=\s*'1/i.test(lower) || /or\s+1\s*=\s*1/i.test(lower)) {
    return todos.slice(); // injection: returns everything
  }
  return todos.filter((t) => t.title.toLowerCase().includes(lower));
}

// VULNERABLE: user input concatenated directly into the query.
app.get('/todos', (req, res) => {
  const q = req.query.q || '';
  // Classic SQLi pattern: `... WHERE title LIKE '%' + q + '%'`
  const results = fakeQuery(q);
  res.json(results);
});

app.get('/health', (_req, res) => {
  // Leaks the secret to prove it's detectable + exploitable.
  res.json({ status: 'ok', secret: API_SECRET });
});

app.listen(3999, () => {
  console.log('⚠️  Vulnerable app on http://localhost:3999 (for exploit lab only)');
});
