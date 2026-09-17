/**
 * Label/value pairs with an optional plain-English hint under the value.
 * Pass text: true for words so only numbers use the mono face.
 */
export default function DetailGrid({ items, columns = 'sm:grid-cols-4' }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-4 gap-y-5 text-sm ${columns}`}>
      {items.map(({ label, value, hint, text }) => (
        <div key={label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-muted">{label}</dt>
          <dd className="flex flex-col gap-0.5">
            <span className={text ? '' : 'num'}>{value}</span>
            {hint && <span className="text-xs leading-snug text-muted/80">{hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
