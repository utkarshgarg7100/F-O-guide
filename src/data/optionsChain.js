import { blackScholes } from '../lib/blackScholes.js'
import { STOCKS } from './stocks.js'

const RISK_FREE_RATE = 0.065
const TICK = 0.05
const EXPIRY_DAYS = [7, 21, 42] // weekly, ~3 weeks, monthly (covers the 1-2 month timeframe)
const STRIKE_OFFSETS = [-0.02, 0, 0.02]

const roundTo = (value, step) => Math.round(value / step) * step

function buildExpiries(today = new Date()) {
  return EXPIRY_DAYS.map((days) => {
    const date = new Date(today)
    date.setDate(date.getDate() + days)
    return { id: `${days}d`, days, date, label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }
  })
}

function buildChain(stock, expiries) {
  const strikes = STRIKE_OFFSETS.map((o) => roundTo(stock.price * (1 + o), stock.strikeStep))
  return expiries.flatMap((expiry) =>
    strikes.flatMap((strike) =>
      ['CE', 'PE'].map((type) => {
        const raw = blackScholes({
          type,
          spot: stock.price,
          strike,
          years: expiry.days / 365,
          iv: stock.iv,
          rate: RISK_FREE_RATE,
        })
        const moneyness =
          strike === stock.price ? 'ATM' : (type === 'CE') === strike < stock.price ? 'ITM' : 'OTM'
        return {
          symbol: stock.symbol,
          expiryId: expiry.id,
          strike,
          type,
          moneyness,
          premium: Number(Math.max(TICK, roundTo(raw, TICK)).toFixed(2)),
        }
      }),
    ),
  )
}

export const EXPIRIES = buildExpiries()

export const CHAINS = Object.fromEntries(STOCKS.map((s) => [s.symbol, buildChain(s, EXPIRIES)]))

export const getContracts = (symbol, { expiryId, type } = {}) =>
  CHAINS[symbol].filter((c) => (!expiryId || c.expiryId === expiryId) && (!type || c.type === type))
