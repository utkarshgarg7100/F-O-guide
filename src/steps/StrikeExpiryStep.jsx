import DetailGrid from '../components/DetailGrid.jsx'
import ContractCard from '../components/ContractCard.jsx'
import WizardNav from '../components/WizardNav.jsx'
import { EXPIRIES, getContracts } from '../data/optionsChain.js'
import { getStock } from '../data/stocks.js'
import { getStrategyForView } from '../data/strategies.js'
import { TERM_HINTS } from '../data/terms.js'
import { getTimeframe } from '../data/timeframes.js'
import { closestExpiry, lotCost, recommendContract, sortByMoneyness } from '../lib/contracts.js'
import { formatINR } from '../lib/format.js'
import { useWizard } from '../wizard/WizardContext.jsx'

const TYPE_NOTES = {
  CE: (symbol) =>
    `Calls: ITM (in the money) means the strike is below today's price, ATM (at the money) is at it, OTM (out of the money) is above it. You profit at expiry if ${symbol} ends above your breakeven.`,
  PE: (symbol) =>
    `Puts work the opposite way from calls: ITM (in the money) means the strike is above today's price, ATM (at the money) is at it, OTM (out of the money) is below it. You profit at expiry if ${symbol} ends below your breakeven.`,
}

export default function StrikeExpiryStep() {
  const { state, update, next, goTo } = useWizard()
  const stock = getStock(state.symbol)
  const strategy = getStrategyForView(state.view)
  const timeframe = getTimeframe(state.timeframe)

  if (!stock || !strategy || !timeframe) return <WizardNav canContinue={false} />

  const expiry = closestExpiry(EXPIRIES, timeframe.targetDays)
  const candidates = sortByMoneyness(getContracts(stock.symbol, { expiryId: expiry.id, type: strategy.optionType }))
  const recommended = recommendContract(candidates, stock.lotSize, state.riskBudget)

  // A strike saved for a different stock/expiry doesn't count as a selection.
  const saved = state.expiryId === expiry.id ? candidates.find((c) => c.strike === state.strike) : null
  const selected = saved ?? recommended
  const selectedFits = selected && lotCost(selected, stock.lotSize) <= state.riskBudget

  const atm = candidates.find((c) => c.moneyness === 'ATM')

  return (
    <div className="flex flex-col gap-8">
      <DetailGrid
        items={[
          { label: 'Trade', value: `${strategy.name} on ${stock.symbol}`, text: true },
          { label: 'Spot price', value: formatINR(stock.price), hint: TERM_HINTS.spot },
          { label: 'Expiry', value: `${expiry.label} (${expiry.days} days)`, hint: TERM_HINTS.expiry },
          { label: 'Risk budget', value: formatINR(state.riskBudget), hint: 'The most you chose to lose' },
        ]}
      />

      <p className="rounded-lg border border-line bg-panel px-4 py-3 text-sm leading-relaxed">
        {TYPE_NOTES[strategy.optionType](stock.symbol)}
      </p>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Choose a strike</legend>
        {candidates.map((c) => (
          <ContractCard
            key={c.strike}
            contract={c}
            symbol={stock.symbol}
            lotSize={stock.lotSize}
            budget={state.riskBudget}
            selected={selected?.strike === c.strike}
            recommended={recommended?.strike === c.strike}
            onSelect={() => update({ expiryId: expiry.id, strike: c.strike })}
          />
        ))}
      </fieldset>

      {recommended ? (
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted">
          <span className="text-fg">Why {recommended.moneyness}:</span> it performs reasonably across a wider range of
          outcomes, which suits a view without a strong opinion on how big the move will be. OTM isn't a bad trade; it
          just needs a larger move to pay off.
        </p>
      ) : (
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted">
          <span className="text-loss">No ITM or ATM contract fits your budget.</span> One ATM lot costs{' '}
          {formatINR(lotCost(atm, stock.lotSize))}. You can{' '}
          <button type="button" onClick={() => goTo(0)} className="text-fg underline underline-offset-4">
            raise your risk budget
          </button>{' '}
          or pick the OTM contract if it fits.
        </p>
      )}

      {selected && !selectedFits && (
        <p className="text-sm text-loss">
          One lot of this contract costs {formatINR(lotCost(selected, stock.lotSize))}, above your{' '}
          {formatINR(state.riskBudget)} risk budget. Choose another strike or raise your budget.
        </p>
      )}

      <WizardNav
        canContinue={Boolean(selectedFits)}
        onContinue={() => {
          update({ expiryId: expiry.id, strike: selected.strike })
          next()
        }}
      />
    </div>
  )
}
