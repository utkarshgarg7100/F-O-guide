const MONEYNESS_ORDER = { ITM: 0, ATM: 1, OTM: 2 }

/** Expiry whose days-to-expiry is nearest the timeframe's target. */
export const closestExpiry = (expiries, targetDays) =>
  expiries.reduce((best, e) => (Math.abs(e.days - targetDays) < Math.abs(best.days - targetDays) ? e : best))

export const breakeven = ({ type, strike, premium }) => (type === 'CE' ? strike + premium : strike - premium)

export const lotCost = (contract, lotSize) => Math.round(contract.premium * lotSize * 100) / 100

export const lotsWithinBudget = (contract, lotSize, budget) => Math.floor(budget / lotCost(contract, lotSize))

export const sortByMoneyness = (contracts) =>
  [...contracts].sort((a, b) => MONEYNESS_ORDER[a.moneyness] - MONEYNESS_ORDER[b.moneyness])

/**
 * ITM if one lot fits the budget, else ATM, else null.
 * OTM is never the default: not a worse trade, just more dependent on a large move.
 */
export function recommendContract(contracts, lotSize, budget) {
  for (const moneyness of ['ITM', 'ATM']) {
    const c = contracts.find((x) => x.moneyness === moneyness)
    if (c && lotsWithinBudget(c, lotSize, budget) >= 1) return c
  }
  return null
}
