import { breakeven } from '../lib/contracts.js'
import { formatPrice } from '../lib/format.js'

/**
 * Breakeven with its calculation shown inline. Same format everywhere it appears.
 * `note` is an optional plain-English line under the formula.
 */
export default function BreakevenDetail({ contract, note, noteClassName = '' }) {
  const isCall = contract.type === 'CE'

  return (
    <div className="flex flex-col gap-1 text-sm">
      <p className="num leading-relaxed break-words">
        <span className="text-muted">Breakeven = Strike ({formatPrice(contract.strike)})</span>{' '}
        <span className="text-muted">
          {isCall ? '+' : '−'} Premium ({formatPrice(contract.premium)}) =
        </span>{' '}
        <span className="text-base font-medium text-fg">{formatPrice(breakeven(contract))}</span>
      </p>
      {note && <p className={`text-xs leading-snug text-muted/80 ${noteClassName}`}>{note}</p>}
    </div>
  )
}
