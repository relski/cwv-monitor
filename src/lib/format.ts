// null -> '–' (a CLS of 0 is a perfect score, so don't use a falsy check)
export const ms = (v: number | null) =>
	v === null ? "–" : `${Math.round(v)} ms`;
// milliseconds in, seconds out (2340 -> "2.34 s")
export const seconds = (v: number | null) =>
	v === null ? "–" : `${(v / 1000).toFixed(2)} s`;
export const cls = (v: number | null) => (v === null ? "–" : v.toFixed(3));
export const score = (value: number | null) =>
	value === null ? "–" : String(Math.round(value));
