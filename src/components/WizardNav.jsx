import { useWizard } from '../wizard/WizardContext.jsx'

const base =
  'h-11 rounded-lg px-5 text-sm font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40'

export default function WizardNav({ canContinue = true, onContinue, continueLabel = 'Continue' }) {
  const { state, next, back } = useWizard()

  return (
    <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
      <button type="button" onClick={back} disabled={state.stepIndex === 0} className={`${base} text-muted hover:text-fg`}>
        Back
      </button>
      <button
        type="button"
        onClick={onContinue ?? next}
        disabled={!canContinue}
        className={`${base} flex-1 bg-accent text-accent-ink hover:brightness-110 sm:flex-none`}
      >
        {continueLabel}
      </button>
    </div>
  )
}
