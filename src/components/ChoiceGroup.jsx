// Radio group rendered as tappable cards. Native inputs keep keyboard + screen reader support.
export default function ChoiceGroup({ name, legend, options, value, onChange, columns = 'sm:grid-cols-3' }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-medium text-muted">{legend}</legend>
      <div className={`grid grid-cols-1 gap-3 ${columns}`}>
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition active:scale-[0.98] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/60 ${
                selected ? 'border-accent bg-accent/10' : 'border-line bg-panel hover:border-muted/50'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{opt.title}</span>
                {opt.aside && <span className="num text-sm text-fg">{opt.aside}</span>}
              </span>
              {opt.hint && <span className="text-sm text-muted">{opt.hint}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
