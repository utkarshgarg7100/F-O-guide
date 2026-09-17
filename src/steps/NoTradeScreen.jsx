import { useWizard } from '../wizard/WizardContext.jsx'

export default function NoTradeScreen() {
  const { update } = useWizard()

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">No trade is a valid decision</h1>
      <div className="flex max-w-[60ch] flex-col gap-4 text-muted">
        <p>
          Buying an option is a bet on direction <em>and</em> timing. If the stock drifts sideways, the premium (the
          price you paid for the option) slowly shrinks to zero as expiry approaches.
        </p>
        <p>
          Without a clear view, that decay works against you. Waiting until you have one is usually the better
          choice for a first trade.
        </p>
      </div>
      <div className="border-t border-line pt-6">
        <button
          type="button"
          onClick={() => update({ outcome: null, view: null, direction: -1 })}
          className="h-11 w-full rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
        >
          Change my view
        </button>
      </div>
    </section>
  )
}
