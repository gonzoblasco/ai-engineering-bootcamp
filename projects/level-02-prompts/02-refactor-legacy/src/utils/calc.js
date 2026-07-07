// src/utils/calc.js
// Refactor de la función `calc` misteriosa del legacy.
// Antes: `calc(a, b, c)` con magic numbers y sin nombre claro.
// Ahora: `calculateAdjustedScore` con intención revelada.

const ADJUSTMENT_FACTOR = 1.18;
const UPPER_PENALTY = 10;
const UPPER_THRESHOLD = 100;

/**
 * Calcula un score ajustado a partir de tres componentes.
 *   score = (a*2) + (b+5) + (c-1)
 * Aplica un penalty si el score supera 100, y floor en 0.
 * Finalmente multiplica por el factor de ajuste (1.18).
 */
function calculateAdjustedScore(a, b, c) {
  const base = a * 2 + (b + 5) + (c - 1);
  const penalized = base > UPPER_THRESHOLD ? base - UPPER_PENALTY : base;
  const floored = Math.max(penalized, 0);
  return floored * ADJUSTMENT_FACTOR;
}

module.exports = { calculateAdjustedScore };