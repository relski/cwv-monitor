// null -> '–' (a CLS of 0 is a perfect score, so don't use a falsy check)
export const ms = (v: number | null) =>
	v === null ? "–" : `${Math.round(v)} ms`;
// milliseconds in, seconds out (2340 -> "2.34 s")
export const seconds = (v: number | null) =>
	v === null ? "–" : `${(v / 1000).toFixed(2)} s`;
export const cls = (v: number | null) => (v === null ? "–" : v.toFixed(3));
export const score = (value: number | null) =>
	value === null ? "–" : String(Math.round(value));
// "https://www.example.com/page" -> "example.com/page" (display only; the stored URL is unchanged)
export const displayUrl = (url: string): string => {
	try {
		const parsed = new URL(url);
		const host = parsed.host.replace(/^www\./, "");
		const rest = parsed.pathname + parsed.search;
		return host + (rest === "/" ? "" : rest);
	} catch {
		return url;
	}
};
