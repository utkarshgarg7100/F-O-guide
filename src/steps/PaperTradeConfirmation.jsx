import DetailGrid from '../components/DetailGrid.jsx'
import { TERM_HINTS } from '../data/terms.js'
import { formatINR, formatPrice } from '../lib/format.js'
import { selectOrder } from '../wizard/selectors.js'
import { useWizard } from '../wizard/WizardContext.jsx'

export default function PaperTradeConfirmation() {
  const { state, reset } = useWizard()
  const order = selectOrder(state)
  if (!order) return null

  const { stock, contract, expiry, strategy } = order

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-accent/40 bg-panel p-5 sm:p-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-accent">Paper Trade Confirmed</p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {strategy.name}: {order.lots} {order.lots === 1 ? 'lot' : 'lots'} of {stock.symbol}{' '}
          <span className="num">{contract.strike}</span> {contract.type}
        </h1>
        <p className="text-sm text-muted">No real order was placed. Nothing is saved when you leave this page.</p>
      </header>

      <DetailGrid
        items={[
          { label: 'Strike', value: formatPrice(contract.strike), hint: TERM_HINTS.strike(contract.type) },
          { label: 'Expiry', value: expiry.label, hint: TERM_HINTS.expiry },
          { label: 'Quantity', value: `${order.quantity.toLocaleString('en-IN')} shares`, hint: `${order.lots} × lot size of ${stock.lotSize}` },
          { label: 'Premium / share', value: formatPrice(contract.premium), hint: TERM_HINTS.premium },
          { label: 'Total paid', value: formatPrice(order.totalCost), hint: TERM_HINTS.totalCost },
          { label: 'Max loss', value: formatPrice(order.maxLoss), hint: TERM_HINTS.maxLoss },
          { label: 'Breakeven', value: formatPrice(order.breakeven), hint: TERM_HINTS.breakeven(contract.type, stock.symbol) },
          { label: 'Budget left', value: formatINR(Math.floor(order.budget - order.totalCost)) },
        ]}
      />

      <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm">
        <span className="font-medium text-accent">Exit plan:</span> square off (sell the option back) before{' '}
        {expiry.label} to avoid physical settlement.
      </p>

      <div className="border-t border-line pt-6">
        <button
          type="button"
          onClick={reset}
          className="h-11 w-full rounded-lg border border-line px-5 text-sm font-medium transition hover:bg-raised active:scale-[0.98] sm:w-auto"
        >
          Plan another trade
        </button>
      </div>
    </section>
  )
}
