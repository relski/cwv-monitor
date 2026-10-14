// null -> '–' (a CLS of 0 is a perfect score, so don't use a falsy check)
export const ms = (v: number | null) => (v === null ? '–' : `${Math.round(v)} ms`)
export const cls = (v: number | null) => (v === null ? '–' : v.toFixed(3))