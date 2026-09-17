const STYLES = {
  ITM: 'border-accent/40 text-accent',
  ATM: 'border-fg/30 text-fg',
  OTM: 'border-line text-muted',
}

export default function MoneynessBadge({ moneyness }) {
  return (
    <span className={`num rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${STYLES[moneyness]}`}>
      {moneyness}
    </span>
  )
}
