(function () {
  "use strict";

  // ===== CHARACTER POOLS =====
  const POOLS = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  // ===== DOM REFERENCES =====
  const passwordField = document.getElementById("password");
  const copyBtn = document.getElementById("copyBtn");
  const lengthInput = document.getElementById("length");
  const lengthValue = document.getElementById("lengthValue");
  const uppercaseInput = document.getElementById("uppercase");
  const numbersInput = document.getElementById("numbers");
  const symbolsInput = document.getElementById("symbols");
  const errorEl = document.getElementById("error");
  const generateBtn = document.getElementById("generateBtn");
  const optionsForm = document.getElementById("optionsForm");
  const strengthFill = document.getElementById("strengthFill");
  const strengthLabel = document.getElementById("strengthLabel");
  const toast = document.getElementById("toast");

  // ===== SECURE RANDOM =====
  // Uses the Web Crypto API for cryptographically secure randomness.
  // Returns a random integer in [0, max).
  function secureRandomInt(max) {
    const maxUint32 = 0xffffffff;
    // Reject values that would introduce modulo bias.
    const limit = maxUint32 - (maxUint32 % max);
    const array = new Uint32Array(1);
    let value;
    do {
      crypto.getRandomValues(array);
      value = array[0];
    } while (value >= limit);
    return value % max;
  }

  // ===== PASSWORD GENERATION =====
  function generatePassword() {
    const length = parseInt(lengthInput.value, 10);
    const useUppercase = uppercaseInput.checked;
    const useNumbers = numbersInput.checked;
    const useSymbols = symbolsInput.checked;

    // Lowercase is always included as the base set.
    let pool = POOLS.lowercase;
    const required = [];

    if (useUppercase) {
      pool += POOLS.uppercase;
      required.push(POOLS.uppercase[secureRandomInt(POOLS.uppercase.length)]);
    }
    if (useNumbers) {
      pool += POOLS.numbers;
      required.push(POOLS.numbers[secureRandomInt(POOLS.numbers.length)]);
    }
    if (useSymbols) {
      pool += POOLS.symbols;
      required.push(POOLS.symbols[secureRandomInt(POOLS.symbols.length)]);
    }

    // Fill the rest of the length with random picks from the full pool.
    const remaining = length - required.length;
    const chars = required.slice();
    for (let i = 0; i < remaining; i++) {
      chars.push(pool[secureRandomInt(pool.length)]);
    }

    // Shuffle so the guaranteed characters aren't always at the start.
    for (let i = chars.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
    }

    return chars.join("");
  }

  // ===== STRENGTH CALCULATION =====
  // Score based on length + variety of character types used.
  function calculateStrength(password) {
    let score = 0;

    // Length contribution (0-40 points)
    if (password.length >= 16) score += 40;
    else if (password.length >= 12) score += 30;
    else if (password.length >= 10) score += 20;
    else score += 10;

    // Variety contribution (0-60 points, 15 per type)
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    return score; // 0-100
  }

  const STRENGTH_LEVELS = [
    { min: 0, label: "Muy débil", color: "var(--strength-weak)", width: "20%" },
    { min: 30, label: "Débil", color: "var(--strength-weak)", width: "35%" },
    { min: 50, label: "Media", color: "var(--strength-medium)", width: "55%" },
    { min: 70, label: "Fuerte", color: "var(--strength-strong)", width: "80%" },
    { min: 85, label: "Muy fuerte", color: "var(--strength-very-strong)", width: "100%" },
  ];

  function updateStrength(password) {
    const score = calculateStrength(password);
    let level = STRENGTH_LEVELS[0];
    for (const candidate of STRENGTH_LEVELS) {
      if (score >= candidate.min) level = candidate;
    }
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthLabel.textContent = level.label;
    strengthLabel.style.color = level.color;
  }

  // ===== VALIDATION =====
  function validateOptions() {
    // Lowercase is always on, so at least the base set is available.
    // No extra options selected is allowed but we warn the user.
    if (!uppercaseInput.checked && !numbersInput.checked && !symbolsInput.checked) {
      errorEl.textContent = "⚠️ Activa al menos una opción para mayor seguridad.";
      return false;
    }
    errorEl.textContent = "";
    return true;
  }

  // ===== CLIPBOARD COPY =====
  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2000);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // Fall through to legacy approach.
    }
    // Legacy fallback for non-secure contexts.
    try {
      passwordField.removeAttribute("readonly");
      passwordField.focus();
      passwordField.select();
      const ok = document.execCommand("copy");
      passwordField.setAttribute("readonly", "");
      return ok;
    } catch (err) {
      return false;
    }
  }

  // ===== MAIN UPDATE FLOW =====
  function regenerate() {
    if (!validateOptions()) {
      passwordField.value = "";
      strengthFill.style.width = "0";
      strengthLabel.textContent = "—";
      strengthLabel.style.color = "var(--text-muted)";
      return;
    }
    const password = generatePassword();
    passwordField.value = password;
    updateStrength(password);
  }

  // ===== EVENT WIRING =====
  // Length slider updates the label live and regenerates.
  lengthInput.addEventListener("input", function () {
    lengthValue.textContent = lengthInput.value;
    regenerate();
  });

  // Toggles regenerate so the preview stays in sync.
  uppercaseInput.addEventListener("change", regenerate);
  numbersInput.addEventListener("change", regenerate);
  symbolsInput.addEventListener("change", regenerate);

  // Generate button (form submit).
  optionsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    regenerate();
  });

  // Copy button.
  copyBtn.addEventListener("click", async function () {
    const text = passwordField.value;
    if (!text) {
      showToast("Nada que copiar");
      return;
    }
    const ok = await copyToClipboard(text);
    showToast(ok ? "¡Copiado!" : "No se pudo copiar");
  });

  // ===== INIT =====
  regenerate();
})();