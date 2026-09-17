// Run: node src/data/optionsChain.check.js
import assert from 'node:assert/strict'
import { CHAINS, EXPIRIES, getContracts, getExpiryComparison } from './optionsChain.js'

const rank = { ITM: 2, ATM: 1, OTM: 0 }
for (const symbol of Object.keys(CHAINS)) {
  for (const { id } of EXPIRIES) {
    for (const type of ['CE', 'PE']) {
      const rows = getContracts(symbol, { expiryId: id, type }).sort((a, b) => rank[a.moneyness] - rank[b.moneyness])
      assert.equal(rows.length, 3)
      assert.ok(rows[0].premium < rows[1].premium && rows[1].premium < rows[2].premium, `${symbol} ${id} ${type} OTM<ATM<ITM`)
    }
  }
  for (let e = 1; e < EXPIRIES.length; e++) {
    const near = getContracts(symbol, { expiryId: EXPIRIES[e - 1].id })
    const far = getContracts(symbol, { expiryId: EXPIRIES[e].id })
    near.forEach((c, i) => assert.ok(far[i].premium > c.premium, `${symbol} ${c.strike}${c.type} longer expiry costs more`))
  }
  console.table(CHAINS[symbol])
}
for (const c of Object.values(CHAINS).flat()) {
  const { expiry, other, otherExpiry } = getExpiryComparison(c)
  assert.ok(other && other.strike === c.strike && other.type === c.type && otherExpiry.id !== expiry.id)
  assert.equal(otherExpiry.days < expiry.days, other.premium < c.premium, 'more days must mean a higher premium')
}
console.log('chain checks passed')
