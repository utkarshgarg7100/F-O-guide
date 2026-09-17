import { createContext, useContext, useReducer } from 'react'
import { STEPS } from './steps.js'

const initialState = {
  stepIndex: 0,
  direction: 1, // 1 forward, -1 back; drives the step transition
  symbol: null, // 'RELIANCE' | 'TCS' | 'HDFCBANK'
  view: null, // 'bullish' | 'bearish' | 'neutral'
  riskBudget: 25000, // max loss in ₹
  timeframe: null, // 'days' | 'weeks' | 'months'
  strategy: null, // 'buy-call' | 'buy-put'
  expiryId: null,
  strike: null,
  outcome: null, // 'no-trade' | 'confirmed' once the flow ends
}

const clampStep = (i) => Math.max(0, Math.min(STEPS.length - 1, i))

const moveTo = (state, index) => {
  const stepIndex = clampStep(index)
  return { ...state, stepIndex, direction: stepIndex >= state.stepIndex ? 1 : -1 }
}

function reducer(state, action) {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.patch }
    case 'next':
      return moveTo(state, state.stepIndex + 1)
    case 'back':
      return moveTo(state, state.stepIndex - 1)
    case 'goTo':
      // Only allow jumping back to steps already visited.
      return action.index <= state.stepIndex ? moveTo(state, action.index) : state
    case 'reset':
      return { ...initialState, direction: -1 }
    default:
      throw new Error(`Unknown wizard action: ${action.type}`)
  }
}

const WizardContext = createContext(null)

export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const actions = {
    update: (patch) => dispatch({ type: 'update', patch }),
    next: () => dispatch({ type: 'next' }),
    back: () => dispatch({ type: 'back' }),
    goTo: (index) => dispatch({ type: 'goTo', index }),
    reset: () => dispatch({ type: 'reset' }),
  }
  return <WizardContext.Provider value={{ state, ...actions }}>{children}</WizardContext.Provider>
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used inside <WizardProvider>')
  return ctx
}

/** True once the user has changed anything, so "Start over" has something to clear. */
export const hasProgress = (state) =>
  state.stepIndex > 0 || state.outcome !== null || Boolean(state.symbol || state.view || state.timeframe)
