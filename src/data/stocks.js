// Mock underlyings. iv and strikeStep are illustrative, not live data.
export const STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 1310, lotSize: 500, strikeStep: 10, iv: 0.22 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3100, lotSize: 225, strikeStep: 50, iv: 0.19 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 970, lotSize: 650, strikeStep: 10, iv: 0.18 },
]

export const getStock = (symbol) => STOCKS.find((s) => s.symbol === symbol)
