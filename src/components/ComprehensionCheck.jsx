import { useState } from 'react'
import { formatPrice } from '../lib/format.js'
import { buildQuiz } from '../lib/order.js'

export default function ComprehensionCheck({ order, passed, onPass }) {
  const [answerId, setAnswerId] = useState(null)
  const { scenario, options } = buildQuiz(order)
  const isCall = order.contract.type === 'CE'
  const answer = options.find((o) => o.id === answerId)

  const corrections = {
    'payoff-as-profit': `Not quite: the option is worth ${formatPrice(scenario.payoff)}, but you paid ${formatPrice(order.totalCost)}, so you're still down ${formatPrice(-scenario.net)}.`,
    'full-loss': `Not quite: the price is ${isCall ? 'above' : 'below'} the strike, so the option keeps ${formatPrice(scenario.payoff)} of value and you lose ${formatPrice(-scenario.net)}, not everything.`,
  }

  const choose = (option) => {
    setAnswerId(option.id)
    if (option.correct) onPass()
  }

  return (
    <fieldset className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:p-5">
      <legend className="px-1 text-sm text-muted">Quick check before you place the order</legend>
      <p className="font-medium">
        {order.stock.symbol} closes at <span className="num">{formatPrice(scenario.expiryPrice)}</span> on expiry. What's
        your result?
      </p>
      <div className="flex flex-col gap-2">
        {options.map((o) => {
          const chosen = answerId === o.id
          const tone = chosen ? (o.correct ? 'border-accent bg-accent/10' : 'border-loss/60 bg-loss/10') : 'border-line hover:border-muted/50'
          return (
            <button
              key={o.id}
              type="button"
              disabled={passed}
              onClick={() => choose(o)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition active:scale-[0.99] disabled:cursor-default ${tone}`}
            >
              A {o.outcome} of <span className="num">{formatPrice(o.amount)}</span>
            </button>
          )
        })}
      </div>
      <p aria-live="polite" className="min-h-5 text-sm">
        {answer && !answer.correct && <span className="text-loss">{corrections[answer.id]} Try again.</span>}
        {passed && (
          <span className="text-accent">
            Correct. The option is worth {formatPrice(scenario.payoff)}, which is less than the {formatPrice(order.totalCost)} you paid.
          </span>
        )}
      </p>
    </fieldset>
  )
}
