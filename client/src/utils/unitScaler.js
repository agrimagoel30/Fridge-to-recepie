/**
 * Intelligent recipe ingredient scaler & cooking fraction formatter.
 */

// Common culinary fractions mapping (tolerance 0.05)
const FRACTIONS = [
  { val: 0.125, str: '1/8' },
  { val: 0.25, str: '1/4' },
  { val: 0.333, str: '1/3' },
  { val: 0.5, str: '1/2' },
  { val: 0.666, str: '2/3' },
  { val: 0.75, str: '3/4' },
  { val: 0.875, str: '7/8' },
];

export function scaleAmount(baseAmount, currentServings, originalServings) {
  if (!baseAmount || isNaN(baseAmount)) return '';
  const ratio = (currentServings || 1) / (originalServings || 1);
  const scaled = baseAmount * ratio;
  return scaled;
}

export function formatCulinaryQuantity(val, unit = '') {
  if (val === null || val === undefined || isNaN(val)) return '';
  if (val === 0) return '0';

  const lowerUnit = (unit || '').toLowerCase();
  const isMetric = ['g', 'gram', 'grams', 'ml', 'milliliter', 'milliliters'].includes(lowerUnit);

  // If metric (grams, ml), round to nearest sensible whole number
  if (isMetric) {
    return Math.round(val).toString();
  }

  // If very small quantity
  if (val < 0.1) {
    return 'a pinch of';
  }

  const whole = Math.floor(val);
  const decimal = val - whole;

  // Check if decimal is close to zero
  if (decimal < 0.06) {
    return whole.toString();
  }

  // Check if decimal is close to 1
  if (decimal > 0.94) {
    return (whole + 1).toString();
  }

  // Find closest cooking fraction
  let closest = FRACTIONS[0];
  let minDiff = Math.abs(decimal - FRACTIONS[0].val);

  for (let i = 1; i < FRACTIONS.length; i++) {
    const diff = Math.abs(decimal - FRACTIONS[i].val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = FRACTIONS[i];
    }
  }

  if (minDiff < 0.08) {
    return whole > 0 ? `${whole} ${closest.str}` : closest.str;
  }

  // Fallback to 1 decimal place if not a common fraction
  return val.toFixed(1).replace(/\.0$/, '');
}
