import ChoiceGroup from '../components/ChoiceGroup.jsx'
import WizardNav from '../components/WizardNav.jsx'
import { STOCKS } from '../data/stocks.js'
import { TIMEFRAMES } from '../data/timeframes.js'
import { formatINR } from '../lib/format.js'
import { useWizard } from '../wizard/WizardContext.jsx'

const VIEWS = [
  { value: 'bullish', title: 'Bullish', hint: 'I expect the price to rise.' },
  { value: 'bearish', title: 'Bearish', hint: 'I expect the price to fall.' },
  { value: 'neutral', title: 'Neutral / Unsure', hint: 'No strong opinion either way.' },
]

const RISK_BUDGET = { min: 1000, max: 50000, step: 500 }

export default function YourViewStep() {
  const { state, update, next } = useWizard()
  const canContinue = Boolean(state.symbol && state.view && state.timeframe)

  const handleContinue = () => (state.view === 'neutral' ? update({ outcome: 'no-trade' }) : next())

  return (
    <div className="flex flex-col gap-10">
      <ChoiceGroup
        name="symbol"
        legend="Which stock?"
        value={state.symbol}
        onChange={(symbol) => update({ symbol })}
        options={STOCKS.map((s) => ({ value: s.symbol, title: s.symbol, hint: s.name, aside: formatINR(s.price) }))}
      />

      <ChoiceGroup
        name="view"
        legend="What do you expect?"
        value={state.view}
        onChange={(view) => update({ view })}
        options={VIEWS}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <label htmlFor="risk-budget" className="text-sm font-medium text-muted">
            Most you're willing to lose
          </label>
          <output htmlFor="risk-budget" className="num text-xl text-fg">
            {formatINR(state.riskBudget)}
          </output>
        </div>
        <input
          id="risk-budget"
          type="range"
          {...RISK_BUDGET}
          value={state.riskBudget}
          onChange={(e) => update({ riskBudget: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer accent-accent"
        />
        <div className="num flex justify-between text-xs text-muted">
          <span>{formatINR(RISK_BUDGET.min)}</span>
          <span>{formatINR(RISK_BUDGET.max)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ChoiceGroup
          name="timeframe"
          legend="How soon do you expect the move?"
          value={state.timeframe}
          onChange={(timeframe) => update({ timeframe })}
          options={TIMEFRAMES}
        />
        <p className="text-sm text-muted">
          Longer timeframes cost more per contract, since you're paying for more time — but give your view more room to
          play out.
        </p>
      </div>

      <WizardNav canContinue={canContinue} onContinue={handleContinue} />
    </div>
  )
}
