import { getExpiryComparison } from '../data/optionsChain.js'
import { formatPrice } from '../lib/format.js'

/** One line tying this contract's time to expiry to its premium and breakeven, using its real numbers. */
export default function ExpiryCostNote({ contract, className = '' }) {
  const { expiry, other, otherExpiry } = getExpiryComparison(contract)
  const side = contract.type === 'CE' ? 'above' : 'below'
  const price = formatPrice(contract.premium)
  const otherPrice = formatPrice(other.premium)

  const text =
    otherExpiry.days < expiry.days
      ? `At ${expiry.days} days, this costs ${price} per share versus ${otherPrice} for the ${otherExpiry.days}-day contract at the same strike, because it has ${expiry.days - otherExpiry.days} more days built in. That's also why its breakeven sits ${price} ${side} the strike instead of ${otherPrice}.`
      : `At ${expiry.days} days, this is the cheapest expiry for this strike: ${price} per share versus ${otherPrice} for ${otherExpiry.days} days, so its breakeven sits only ${price} ${side} the strike. The trade-off is less time for your view to play out.`

  return <p className={`text-xs leading-relaxed text-muted ${className}`}>{text}</p>
}
