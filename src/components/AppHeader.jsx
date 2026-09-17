import { hasProgress, useWizard } from '../wizard/WizardContext.jsx'

export default function AppHeader() {
  const { state, reset } = useWizard()

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <span className="text-[15px] font-semibold tracking-tight">First Options Trade</span>
          <span className="truncate text-[11px] text-muted sm:text-xs">Mock prices, for learning only</span>
        </div>
        {hasProgress(state) && (
          <button
            type="button"
            onClick={reset}
            className="h-9 shrink-0 rounded-lg border border-line px-3 text-sm text-muted transition hover:bg-raised hover:text-fg active:scale-[0.98]"
          >
            Start over
          </button>
        )}
      </div>
    </header>
  )
}
