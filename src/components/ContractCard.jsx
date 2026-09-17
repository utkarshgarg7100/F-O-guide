import { TERM_HINTS } from '../data/terms.js'
import { breakeven, lotCost, lotsWithinBudget } from '../lib/contracts.js'
import { formatPrice as price } from '../lib/format.js'
import MoneynessBadge from './MoneynessBadge.jsx'

// Leverage vs. consistency, never safety vs. risk.
const TRADE_OFFS = {
  ITM: 'Costs more per lot, so your budget buys fewer. More likely to stay profitable across a wider range of outcomes, with less upside on a big move.',
  ATM: 'The middle ground: a moderate price per lot, with gains that start as soon as the stock moves your way.',
  OTM: 'Cheapest, so your budget buys more lots. A small move may return little, but a large move pays out disproportionately more.',
}

export default function ContractCard({ contract, symbol, lotSize, budget, selected, recommended, onSelect }) {
  // Phones: hints only on the selected card so three cards don't repeat them. Always shown from sm up.
  const hintVisibility = selected ? '' : 'hidden sm:block'
  const cost = lotCost(contract, lotSize)
  const lots = lotsWithinBudget(contract, lotSize, budget)

  const metrics = [
    ['Premium / share', price(contract.premium), TERM_HINTS.premium],
    ['Lot size', lotSize.toLocaleString('en-IN'), TERM_HINTS.lotSize],
    ['Total cost (1 lot)', price(cost), TERM_HINTS.lotCost],
    ['Breakeven', price(breakeven(contract)), TERM_HINTS.breakeven(contract.type, symbol)],
  ]

  return (
    <label
      className={`flex cursor-pointer flex-col gap-4 rounded-xl border p-4 transition active:scale-[0.99] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/60 sm:p-5 ${
        selected ? 'border-accent bg-accent/10' : 'border-line bg-panel hover:border-muted/50'
      }`}
    >
      <input type="radio" name="contract" checked={selected} onChange={onSelect} className="sr-only" />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex flex-col">
          <span className="flex items-center gap-2">
            <span className="text-xs text-muted">Strike</span>
            <span className="num text-xl font-medium">{contract.strike.toLocaleString('en-IN')}</span>
            <span className="text-sm text-muted">{contract.type}</span>
            <MoneynessBadge moneyness={contract.moneyness} />
          </span>
          <span className={`text-xs text-muted/80 ${hintVisibility}`}>{TERM_HINTS.strike(contract.type)}</span>
        </div>
        {recommended && (
          <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-ink">Recommended for you</span>
        )}
        <span className={`w-full text-sm sm:ml-auto sm:w-auto ${lots ? 'text-muted' : 'text-loss'}`}>
          {lots ? `${lots} ${lots === 1 ? 'lot fits' : 'lots fit'} your budget` : 'Over your budget'}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {metrics.map(([label, value, hint]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="flex flex-col gap-0.5">
              <span className="num">{value}</span>
              <span className={`text-xs leading-snug text-muted/80 ${hintVisibility}`}>{hint}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-sm leading-relaxed text-muted">{TRADE_OFFS[contract.moneyness]}</p>
    </label>
  )
}
