export const TIMEFRAMES = [
  { value: 'days', title: 'Few days', phrase: 'the next few days', targetDays: 5 },
  { value: 'weeks', title: '2-4 weeks', phrase: 'the next 2-4 weeks', targetDays: 21 },
  { value: 'months', title: '1-2 months', phrase: 'the next 1-2 months', targetDays: 45 },
]

export const getTimeframe = (value) => TIMEFRAMES.find((t) => t.value === value)
