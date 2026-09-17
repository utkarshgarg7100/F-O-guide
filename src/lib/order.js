import { breakeven, lotCost, lotsWithinBudget } from './contracts.js'

const TICK = 0.05
const toTick = (v) => Math.round(Math.round(v / TICK) * TICK * 100) / 100
const toPaise = (v) => Math.round(v * 100) / 100

/** Option value at expiry for the whole position. */
export const payoffAtExpiry = ({ type, strike }, expiryPrice, quantity) =>
  toPaise(Math.max(0, type === 'CE' ? expiryPrice - strike : strike - expiryPrice) * quantity)

/** Full order: as many lots as the budget allows (step 3 guarantees at least one). */
export function buildOrder({ stock, contract, expiry, budget }) {
  const costPerLot = lotCost(contract, stock.lotSize)
  const lots = lotsWithinBudget(contract, stock.lotSize, budget)
  const quantity = lots * stock.lotSize
  const totalCost = toPaise(costPerLot * lots)
  const be = toPaise(breakeven(contract))
  const dir = contract.type === 'CE' ? 1 : -1
  // Past both the strike (so the option has value) and today's price (so the move went the user's way).
  const favourableStart = dir > 0 ? Math.max(contract.strike, stock.price) : Math.min(contract.strike, stock.price)

  const scenario = (kind, expiryPrice) => {
    const payoff = payoffAtExpiry(contract, expiryPrice, quantity)
    return { kind, expiryPrice, payoff, net: toPaise(payoff - totalCost) }
  }

  return {
    stock,
    contract,
    expiry,
    budget,
    lots,
    quantity,
    costPerLot,
    totalCost,
    maxLoss: totalCost,
    breakeven: be,
    scenarios: [
      scenario('worthless', contract.strike),
      // A move in the predicted direction from today's price, still short of breakeven.
      scenario('partial', toTick(favourableStart + (be - favourableStart) / 3)),
      scenario('profit', toTick(contract.strike + dir * 2.5 * contract.premium)),
    ],
  }
}

/** Question on the "some value, still a loss" scenario, the one people most often get wrong. */
export function buildQuiz(order) {
  const scenario = order.scenarios.find((x) => x.kind === 'partial')
  return {
    scenario,
    options: [
      { id: 'payoff-as-profit', correct: false, outcome: 'profit', amount: scenario.payoff },
      { id: 'partial-loss', correct: true, outcome: 'loss', amount: -scenario.net },
      { id: 'full-loss', correct: false, outcome: 'loss', amount: order.totalCost },
    ],
  }
}
