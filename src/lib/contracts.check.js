// Run: node src/lib/contracts.check.js
import assert from 'node:assert/strict'
import { CHAINS, EXPIRIES, getContracts } from '../data/optionsChain.js'
import { STOCKS } from '../data/stocks.js'
import { TIMEFRAMES } from '../data/timeframes.js'
import { breakeven, closestExpiry, lotCost, lotsWithinBudget, recommendContract } from './contracts.js'

// Timeframes map to distinct expiries.
assert.deepEqual(TIMEFRAMES.map((t) => closestExpiry(EXPIRIES, t.targetDays).id), ['7d', '21d', '42d'])

// ITM direction flips between calls and puts.
for (const s of STOCKS) {
  for (const c of CHAINS[s.symbol]) {
    if (c.moneyness === 'ITM') assert.ok(c.type === 'CE' ? c.strike < s.price : c.strike > s.price)
    if (c.moneyness === 'OTM') assert.ok(c.type === 'CE' ? c.strike > s.price : c.strike < s.price)
  }
}

assert.equal(breakeven({ type: 'CE', strike: 1310, premium: 28.45 }), 1338.45)
assert.equal(breakeven({ type: 'PE', strike: 1310, premium: 20 }), 1290)
assert.equal(lotCost({ premium: 10.25 }, 650), 6662.5)
assert.equal(lotsWithinBudget({ premium: 10.25 }, 650, 20000), 3)

const hdfc = STOCKS.find((s) => s.symbol === 'HDFCBANK')
const weekCalls = getContracts('HDFCBANK', { expiryId: '7d', type: 'CE' })
assert.equal(recommendContract(weekCalls, hdfc.lotSize, 50000).moneyness, 'ITM')
assert.equal(recommendContract(weekCalls, hdfc.lotSize, 8000).moneyness, 'ATM') // ITM ₹15,372.50 > 8,000 >= ATM ₹6,662.50
assert.equal(recommendContract(weekCalls, hdfc.lotSize, 3000), null)

console.log('contract checks passed')
