// Only long single-leg options: the loss is capped at the premium and known before the order is placed.
export const STRATEGIES = {
  bullish: {
    id: 'buy-call',
    name: 'Buy a Call',
    optionType: 'CE',
    reason: ({ symbol, timeframe }) => [
      `You expect ${symbol} to rise over ${timeframe}.`,
      `You pay the premium (the option's price) once, upfront, and that premium is the most you can lose, however far the stock falls.`,
      `If ${symbol} doesn't rise enough before expiry, the option can expire worthless, which is a loss you know in advance.`,
    ],
  },
  bearish: {
    id: 'buy-put',
    name: 'Buy a Put',
    optionType: 'PE',
    reason: ({ symbol, timeframe }) => [
      `You expect ${symbol} to fall over ${timeframe}.`,
      `You pay the premium (the option's price) once, upfront, and that premium is the most you can lose, however far the stock rises.`,
      `If ${symbol} doesn't fall enough before expiry, the option can expire worthless, which is a loss you know in advance.`,
    ],
  },
}

export const getStrategyForView = (view) => STRATEGIES[view] ?? null
