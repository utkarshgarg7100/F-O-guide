import { useState } from 'react'
import ComprehensionCheck from '../components/ComprehensionCheck.jsx'
import DetailGrid from '../components/DetailGrid.jsx'
import ExpiryScenarios from '../components/ExpiryScenarios.jsx'
import SettlementNote from '../components/SettlementNote.jsx'
import WizardNav from '../components/WizardNav.jsx'
import { TERM_HINTS } from '../data/terms.js'
import { formatPrice } from '../lib/format.js'
import { selectOrder } from '../wizard/selectors.js'
import { useWizard } from '../wizard/WizardContext.jsx'

export default function OrderPreviewStep() {
  const { state, update } = useWizard()
  const [passed, setPassed] = useState(false)
  const order = selectOrder(state)

  if (!order) return <WizardNav canContinue={false} />

  const { stock, contract, expiry, strategy } = order

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <section className="flex flex-col gap-5 rounded-xl border border-line bg-panel p-4 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {strategy.name} on {stock.symbol}
        </h2>
        <DetailGrid
          items={[
            { label: 'Stock', value: stock.symbol, hint: `${TERM_HINTS.spot}: ${formatPrice(stock.price)}`, text: true },
            { label: 'Strike', value: `${formatPrice(contract.strike)} ${contract.type}`, hint: TERM_HINTS.strike(contract.type) },
            { label: 'Expiry', value: `${expiry.label} (${expiry.days} days)`, hint: TERM_HINTS.expiry },
            { label: 'Premium / share', value: formatPrice(contract.premium), hint: TERM_HINTS.premium },
            { label: 'Lot size', value: stock.lotSize.toLocaleString('en-IN'), hint: TERM_HINTS.lotSize },
            { label: 'Cost per lot', value: formatPrice(order.costPerLot), hint: TERM_HINTS.lotCost },
            { label: 'Lots within budget', value: order.lots, hint: TERM_HINTS.lots },
            { label: 'Breakeven', value: formatPrice(order.breakeven), hint: TERM_HINTS.breakeven(contract.type, stock.symbol) },
          ]}
        />
        <div className="grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted">Total cost</span>
            <span className="num text-2xl">{formatPrice(order.totalCost)}</span>
            <span className="text-xs text-muted/80">
              {order.lots} {order.lots === 1 ? 'lot' : 'lots'} × {formatPrice(order.costPerLot)}, {TERM_HINTS.totalCost.toLowerCase()}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted">Max loss</span>
            <span className="num text-2xl text-loss">{formatPrice(order.maxLoss)}</span>
            <span className="text-xs text-muted/80">Equal to total cost. {TERM_HINTS.maxLoss}</span>
          </div>
        </div>
      </section>

      <ExpiryScenarios order={order} />
      <SettlementNote order={order} />
      <ComprehensionCheck order={order} passed={passed} onPass={() => setPassed(true)} />

      <WizardNav
        canContinue={passed}
        continueLabel="Place Order"
        onContinue={() => update({ outcome: 'confirmed', direction: 1 })}
      />
    </div>
  )
}
