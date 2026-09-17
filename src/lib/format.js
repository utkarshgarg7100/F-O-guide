const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const inrPaise = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })

export const formatINR = (value) => inr.format(value)

/** Rupees with paise, for premiums, prices and exact P&L. */
export const formatPrice = (value) => inrPaise.format(value)
