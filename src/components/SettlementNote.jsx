import { formatINR } from '../lib/format.js'

export default function SettlementNote({ order }) {
  const { contract, stock, quantity, expiry } = order
  const contractValue = formatINR(contract.strike * quantity)

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-line bg-panel p-4 text-sm leading-relaxed sm:p-5">
      <h2 className="font-medium">Plan: square off before expiry ({expiry.label})</h2>
      <p className="text-muted">
        Stock options in India are physically settled. If this option is left open and in the money at expiry,{' '}
        {contract.type === 'CE'
          ? `you must pay the full contract value (about ${contractValue}) and take delivery of ${quantity.toLocaleString('en-IN')} ${stock.symbol} shares.`
          : `you must deliver ${quantity.toLocaleString('en-IN')} ${stock.symbol} shares, which usually means buying them first if you don't own them (about ${contractValue}).`}{' '}
        To avoid this, most traders square off (sell the option back) before expiry. That's the expected plan for this trade.
      </p>
    </section>
  )
}
