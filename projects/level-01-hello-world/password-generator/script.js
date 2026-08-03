const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseBox = document.getElementById('uppercase');
const numbersBox = document.getElementById('numbers');
const symbolsBox = document.getElementById('symbols');
const passwordInput = document.getElementById('password');
const strengthEl = document.getElementById('strength');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function generatePassword() {
  const length = parseInt(lengthInput.value, 10);
  const useUpper = uppercaseBox.checked;
  const useNumbers = numbersBox.checked;
  const useSymbols = symbolsBox.checked;

  let pool = LOWER;
  if (useUpper) pool += UPPER;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;

  // Guarantee at least one char from each selected set.
  const required = [];
  if (useUpper) required.push(UPPER);
  if (useNumbers) required.push(NUMBERS);
  if (useSymbols) required.push(SYMBOLS);

  const chars = [];
  for (const set of required) {
    chars.push(set[Math.floor(Math.random() * set.length)]);
  }
  while (chars.length < length) {
    chars.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  // Shuffle so required chars aren't always at the start.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function strengthOf(pw) {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 20) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', cls: 'weak' };
  if (score <= 4) return { label: 'Medium', cls: 'medium' };
  return { label: 'Strong', cls: 'strong' };
}

function updateStrength(pw) {
  const s = strengthOf(pw);
  strengthEl.textContent = `Strength: ${s.label}`;
  strengthEl.style.color =
    s.cls === 'strong' ? '#4ade80' : s.cls === 'medium' ? '#fbbf24' : '#f87171';
}

function refresh() {
  const pw = generatePassword();
  passwordInput.value = pw;
  updateStrength(pw);
}

generateBtn.addEventListener('click', refresh);
lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
  refresh();
});
[uppercaseBox, numbersBox, symbolsBox].forEach((box) => box.addEventListener('change', refresh));

copyBtn.addEventListener('click', async () => {
  if (!passwordInput.value) return;
  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = '✅ Copied';
    setTimeout(() => (copyBtn.textContent = '📋 Copy'), 1500);
  } catch {
    copyBtn.textContent = '❌ Failed';
  }
});

refresh();
