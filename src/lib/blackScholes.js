// Abramowitz & Stegun 26.2.17 normal CDF, accurate to ~7.5e-8.
function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - p : p
}

/** European option price. years = time to expiry, iv/rate as decimals. */
export function blackScholes({ type, spot, strike, years, iv, rate }) {
  const d1 = (Math.log(spot / strike) + (rate + (iv * iv) / 2) * years) / (iv * Math.sqrt(years))
  const d2 = d1 - iv * Math.sqrt(years)
  const df = Math.exp(-rate * years)
  return type === 'CE'
    ? spot * normCdf(d1) - strike * df * normCdf(d2)
    : strike * df * normCdf(-d2) - spot * normCdf(-d1)
}
