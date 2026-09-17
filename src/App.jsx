import { useEffect } from 'react'
import AppHeader from './components/AppHeader.jsx'
import ProgressSteps from './components/ProgressSteps.jsx'
import StepTransition from './components/StepTransition.jsx'
import NoTradeScreen from './steps/NoTradeScreen.jsx'
import OrderPreviewStep from './steps/OrderPreviewStep.jsx'
import PaperTradeConfirmation from './steps/PaperTradeConfirmation.jsx'
import StrategyStep from './steps/StrategyStep.jsx'
import StrikeExpiryStep from './steps/StrikeExpiryStep.jsx'
import YourViewStep from './steps/YourViewStep.jsx'
import { STEPS } from './wizard/steps.js'
import { WizardProvider, useWizard } from './wizard/WizardContext.jsx'

const STEP_COMPONENTS = {
  view: YourViewStep,
  strategy: StrategyStep,
  contract: StrikeExpiryStep,
  preview: OrderPreviewStep,
}

const END_SCREENS = {
  'no-trade': NoTradeScreen,
  confirmed: PaperTradeConfirmation,
}

function Wizard() {
  const { state } = useWizard()
  const step = STEPS[state.stepIndex]
  const StepComponent = STEP_COMPONENTS[step.id]
  const EndScreen = END_SCREENS[state.outcome]

  // New screen starts at the top; matters on mobile where steps are long.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state.stepIndex, state.outcome])

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pt-6 pb-16 sm:gap-10 sm:px-6 sm:pt-12">
      {!EndScreen && <ProgressSteps />}
      <StepTransition key={state.outcome ?? step.id} direction={state.direction} className="flex flex-col gap-6 sm:gap-8">
        {EndScreen ? (
          <EndScreen />
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{step.title}</h1>
            <StepComponent />
          </>
        )}
      </StepTransition>
    </main>
  )
}

export default function App() {
  return (
    <WizardProvider>
      <div className="min-h-dvh">
        <AppHeader />
        <Wizard />
      </div>
    </WizardProvider>
  )
}
