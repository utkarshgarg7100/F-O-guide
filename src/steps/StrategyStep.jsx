import WizardNav from '../components/WizardNav.jsx'
import { getStock } from '../data/stocks.js'
import { getStrategyForView } from '../data/strategies.js'
import { TERM_HINTS } from '../data/terms.js'
import { getTimeframe } from '../data/timeframes.js'
import { formatINR } from '../lib/format.js'
import { useWizard } from '../wizard/WizardContext.jsx'

export default function StrategyStep() {
  const { state, update, next } = useWizard()
  const strategy = getStrategyForView(state.view)
  const stock = getStock(state.symbol)
  const timeframe = getTimeframe(state.timeframe)

  // Step 1 gates entry, so this only guards against a stale state.
  if (!strategy || !stock || !timeframe) return <WizardNav canContinue={false} />

  const handleContinue = () => {
    update({ strategy: strategy.id })
    next()
  }

  return (
    <div className="flex flex-col gap-8">
      <article className="flex flex-col gap-6 rounded-xl border border-accent/40 bg-panel p-5 sm:p-6">
        <p className="rounded-lg border border-line bg-raised/60 px-4 py-3 text-sm leading-relaxed">
          {TERM_HINTS.optionTypeShort(strategy.optionType, stock.symbol)}
        </p>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-accent">Recommended for you</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {strategy.name} <span className="text-muted">on {stock.symbol}</span>
            </h2>
          </div>
          <dl className="flex gap-6 text-sm">
            <div>
              <dt className="text-muted">Timeframe</dt>
              <dd>{timeframe.title}</dd>
            </div>
            <div>
              <dt className="text-muted">Risk budget</dt>
              <dd className="num">{formatINR(state.riskBudget)}</dd>
            </div>
          </dl>
        </header>

        <p className="max-w-[65ch] leading-relaxed text-fg/90">
          {strategy.reason({ symbol: stock.symbol, timeframe: timeframe.phrase }).join(' ')}
        </p>

        <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm">
          <span className="font-medium text-accent">Max loss:</span> the premium you pay (the option's price). Nothing more.
        </p>
      </article>

      <p className="max-w-[65ch] text-sm leading-relaxed text-muted">
        Spreads and option selling exist too, but are left out on purpose: none keeps a loss as simple, capped and
        known upfront as a single bought option, the safest structure for a first trade.
      </p>

      <WizardNav onContinue={handleContinue} />
    </div>
  )
}
