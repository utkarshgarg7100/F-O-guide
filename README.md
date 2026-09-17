# First Options Trade

A short guided flow that helps a first-time equity investor place one informed options order: **Your View → Strategy → Strike & Expiry → Order Preview**, ending in a paper trade.

React + Tailwind, client-side only. All prices are mock data (Black-Scholes on fixed inputs); no real orders are placed.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static build in dist/
```

## Logic checks

```bash
node src/data/optionsChain.check.js
node src/lib/contracts.check.js
node src/lib/order.check.js
```

## Layout

```
src/
  steps/       one component per wizard step, plus the end screens
  components/  shared UI (cards, grids, nav, progress)
  wizard/      step list, shared state, selectors
  data/        mock stocks, options chain, strategies, term hints
  lib/         pricing, contract and order math (pure functions)
```
