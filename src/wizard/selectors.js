import { EXPIRIES, getContracts } from '../data/optionsChain.js'
import { getStock } from '../data/stocks.js'
import { getStrategyForView } from '../data/strategies.js'
import { buildOrder } from '../lib/order.js'

/** The full order implied by wizard state, or null if a choice is missing. */
export function selectOrder(state) {
  const stock = getStock(state.symbol)
  const strategy = getStrategyForView(state.view)
  const expiry = EXPIRIES.find((e) => e.id === state.expiryId)
  if (!stock || !strategy || !expiry) return null

  const contract = getContracts(stock.symbol, { expiryId: expiry.id, type: strategy.optionType }).find(
    (c) => c.strike === state.strike,
  )
  return contract ? { ...buildOrder({ stock, contract, expiry, budget: state.riskBudget }), strategy } : null
}
