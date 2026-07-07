// tests/calc.test.js
const { calculateAdjustedScore } = require('../src/utils/calc');

describe('calculateAdjustedScore', () => {
  it('matches legacy calc for normal values', () => {
    // legacy: a*2 + b+5 + c-1 = 10+15+2 = 27, no penalty, *1.18 = 31.86
    expect(calculateAdjustedScore(5, 10, 3)).toBeCloseTo(31.86, 2);
  });

  it('applies penalty when score > 100', () => {
    // a*2 + b+5 + c-1 = 100+5+0 = 105, -10 = 95, *1.18 = 112.1
    expect(calculateAdjustedScore(50, 0, 1)).toBeCloseTo(112.1, 2);
  });

  it('floors negative scores to 0', () => {
    // a*2 + b+5 + c-1 = -10+0-11 = -21, max(0) = 0, *1.18 = 0
    expect(calculateAdjustedScore(-5, -5, -10)).toBe(0);
  });

  it('returns 0 when all inputs are 0', () => {
    // 0 + 5 + (-1) = 4, *1.18 = 4.72
    expect(calculateAdjustedScore(0, 0, 0)).toBeCloseTo(4.72, 2);
  });
});