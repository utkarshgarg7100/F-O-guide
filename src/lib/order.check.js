// Run: node src/lib/order.check.js
import assert from 'node:assert/strict'
import { EXPIRIES, getContracts } from '../data/optionsChain.js'
import { STOCKS } from '../data/stocks.js'
import { buildOrder, buildQuiz, payoffAtExpiry } from './order.js'

assert.equal(payoffAtExpiry({ type: 'CE', strike: 100 }, 110, 50), 500)
assert.equal(payoffAtExpiry({ type: 'CE', strike: 100 }, 90, 50), 0)
assert.equal(payoffAtExpiry({ type: 'PE', strike: 100 }, 90, 50), 500)
assert.equal(payoffAtExpiry({ type: 'PE', strike: 100 }, 110, 50), 0)

for (const stock of STOCKS) {
  for (const expiry of EXPIRIES) {
    for (const contract of getContracts(stock.symbol, { expiryId: expiry.id })) {
      const order = buildOrder({ stock, contract, expiry, budget: 1e7 })
      const [worthless, partial, profit] = order.scenarios
      const beyond = (a, b) => (contract.type === 'CE' ? a > b : a < b)

      assert.equal(order.totalCost, order.lots * order.costPerLot)
      assert.equal(worthless.net, -order.maxLoss)
      assert.ok(beyond(partial.expiryPrice, contract.strike) && beyond(order.breakeven, partial.expiryPrice))
      assert.ok(beyond(partial.expiryPrice, stock.price), `${stock.symbol} ${contract.strike}${contract.type} partial row must be a favourable move`)
      assert.ok(partial.payoff > 0 && partial.net < 0, 'partial: some value, net loss')
      assert.notEqual(partial.payoff, -partial.net, 'quiz amounts must not coincide')
      assert.ok(beyond(profit.expiryPrice, order.breakeven) && profit.net > 0, 'profit past breakeven')

      const quiz = buildQuiz(order)
      assert.equal(quiz.options.filter((o) => o.correct).length, 1)
      assert.equal(new Set(quiz.options.map((o) => `${o.outcome}${o.amount}`)).size, 3, 'answers distinct')
    }
  }
}
console.log('order checks passed')
