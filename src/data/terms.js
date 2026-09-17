// Plain-English hints shown right under each number. Short on purpose: they sit inside tight grids.
export const TERM_HINTS = {
  optionType: (type, symbol) =>
    type === 'CE'
      ? `A Call lets you buy ${symbol} later at a price fixed today, so you profit if the price goes up.`
      : `A Put lets you sell ${symbol} later at a price fixed today, so you profit if the price goes down.`,
  // Step 2 version: no prices yet, just what the trade is for.
  optionTypeShort: (type, symbol) =>
    type === 'CE' ? `A Call lets you profit if ${symbol}'s price goes up.` : `A Put lets you profit if ${symbol}'s price goes down.`,
  strike: (type) => (type === 'CE' ? 'The price you get the right to buy at' : 'The price you get the right to sell at'),
  premium: 'Price of the option, per share',
  lotSize: 'Shares per contract; options are sold only in lots',
  breakeven: (type, symbol) => `${symbol} must close ${type === 'CE' ? 'above' : 'below'} this at expiry to profit`,
  breakevenWhy: (type, symbol) =>
    type === 'CE'
      ? `A rise alone isn't enough: ${symbol} must close above this price at expiry for the trade to make money.`
      : `A fall alone isn't enough: ${symbol} must close below this price at expiry for the trade to make money.`,
  spot: 'Where the share trades today',
  expiry: 'Last day the option exists',
  lotCost: 'Premium × lot size',
  lots: 'How many lots your budget covers',
  totalCost: 'Paid once, upfront',
  maxLoss: 'If the option expires worthless',
}
