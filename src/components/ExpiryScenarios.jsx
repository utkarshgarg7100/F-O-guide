import { formatPrice } from '../lib/format.js'

// Middle row is the worked example of why breakeven, not direction alone, decides profit.
const ScenarioText = ({ kind, text }) => (
  <>
    {kind === 'partial' && (
      <span className="mb-1 block text-xs font-medium text-fg">Why breakeven matters: right direction, still a loss</span>
    )}
    {text}
  </>
)

const NetResult = ({ net }) => (
  <span className={`num whitespace-nowrap ${net > 0 ? 'text-accent' : 'text-loss'}`}>
    {net > 0 ? '+' : '-'}
    {formatPrice(Math.abs(net))}
  </span>
)

export default function ExpiryScenarios({ order }) {
  const { contract, stock, scenarios, totalCost } = order
  const isCall = contract.type === 'CE'
  const strike = `the ${formatPrice(contract.strike)} strike`
  const be = `the ${formatPrice(order.breakeven)} breakeven`

  const describe = {
    worthless: `At or ${isCall ? 'below' : 'above'} ${strike}: the option expires worthless and you lose the full premium.`,
    partial: `${stock.symbol} ${isCall ? 'rose' : 'fell'} from today's ${formatPrice(stock.price)}, so it moved your way, but stayed short of ${be}. The option is worth less than you paid, so the position is still at a loss.`,
    profit: `${isCall ? 'Above' : 'Below'} ${be}: the option is worth more than you paid.`,
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">What happens at expiry</h2>

      {/* Mobile: one card per outcome */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {scenarios.map((s) => (
          <li
            key={s.kind}
            className={`flex flex-col gap-2 rounded-xl border bg-panel p-4 text-sm ${s.kind === 'partial' ? 'border-muted/40' : 'border-line'}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted">
                {stock.symbol} at <span className="num text-fg">{formatPrice(s.expiryPrice)}</span>
              </span>
              <NetResult net={s.net} />
            </div>
            <p className="text-muted">
              <ScenarioText kind={s.kind} text={describe[s.kind]} />
            </p>
            <p className="text-xs text-muted/80">
              Option worth <span className="num">{formatPrice(s.payoff)}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border border-line sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-muted">
            <tr>
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-normal">If {stock.symbol} closes at</th>
              <th scope="col" className="px-4 py-3 font-normal">What it means</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-normal">Option value</th>
              <th scope="col" className="whitespace-nowrap px-4 py-3 text-right font-normal">Net result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {scenarios.map((s) => (
              <tr key={s.kind} className={s.kind === 'partial' ? 'bg-raised/40' : ''}>
                <td className="num whitespace-nowrap px-4 py-3 align-top">{formatPrice(s.expiryPrice)}</td>
                <td className="px-4 py-3 align-top text-muted">
                  <ScenarioText kind={s.kind} text={describe[s.kind]} />
                </td>
                <td className="num whitespace-nowrap px-4 py-3 text-right align-top">{formatPrice(s.payoff)}</td>
                <td className="px-4 py-3 text-right align-top">
                  <NetResult net={s.net} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Option value is what the option is worth on expiry day. Net result is that value minus the{' '}
        {formatPrice(totalCost)} you paid, before brokerage and taxes.
      </p>
    </section>
  )
}
