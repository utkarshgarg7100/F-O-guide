import { STEPS } from '../wizard/steps.js'
import { useWizard } from '../wizard/WizardContext.jsx'

export default function ProgressSteps() {
  const { state, goTo } = useWizard()

  return (
    <nav aria-label="Progress">
      <ol className="grid grid-cols-4 gap-2 sm:gap-3">
        {STEPS.map((step, i) => {
          const status = i < state.stepIndex ? 'done' : i === state.stepIndex ? 'current' : 'upcoming'
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                disabled={status === 'upcoming'}
                aria-current={status === 'current' ? 'step' : undefined}
                className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
              >
                <span className="h-1 w-full overflow-hidden rounded-full bg-line">
                  <span
                    className={`block h-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      status === 'upcoming' ? '-translate-x-full' : 'translate-x-0'
                    } ${status === 'done' ? 'opacity-60' : ''}`}
                  />
                </span>
                <span className="flex items-baseline gap-1.5 text-xs sm:text-sm">
                  <span className={`num ${status === 'upcoming' ? 'text-muted/60' : 'text-accent'}`}>{i + 1}</span>
                  <span
                    className={`hidden truncate sm:inline ${
                      status === 'current'
                        ? 'text-fg'
                        : status === 'done'
                          ? 'text-muted group-hover:text-fg'
                          : 'text-muted/60'
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-sm sm:hidden">
        <span className="text-muted">
          Step {state.stepIndex + 1} of {STEPS.length}:
        </span>{' '}
        {STEPS[state.stepIndex].label}
      </p>
    </nav>
  )
}
