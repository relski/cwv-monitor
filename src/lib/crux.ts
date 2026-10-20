import { requireEnv } from "./env";

export type CruxResult = {
	source: "url" | "origin";
	lcp: number | null;
	inp: number | null;
	cls: number | null;
};

export type CruxHistoryResult = {
	source: "url" | "origin";
	lcp: number[] | null;
	inp: number[] | null;
	cls: number[] | null;
	dates: { year: number; month: number; day: number }[];
};

// null/undefined -> null, otherwise a real number (CLS arrives as a string)
const toNum = (v: unknown): number | null => (v == null ? null : Number(v));

// One CrUX request. Returns the JSON, or null when Google has no data (404).
const query = async (body: Record<string, string>) => {
	const res = await fetch(
		`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${requireEnv("GOOGLE_API_KEY")}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...body, formFactor: "PHONE" }),
		},
	);

	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`CrUX ${res.status}: ${await res.text()}`);

	return res.json();
};

// CrUX query for historical record fetch
const queryHistory = async (body: Record<string, string>) => {
	const res = await fetch(
		`https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord?key=${requireEnv("GOOGLE_API_KEY")}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...body,
				formFactor: "PHONE",
				collectionPeriodCount: 12,
			}),
		},
	);
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`CrUX ${res.status}: ${await res.text()}`);

	return res.json();
};

const parse = (data: any, source: "url" | "origin"): CruxResult => {
	const metrics = data.record.metrics;

	return {
		source,
		lcp: toNum(metrics.largest_contentful_paint?.percentiles?.p75),
		inp: toNum(metrics.interaction_to_next_paint?.percentiles?.p75),
		cls: toNum(metrics.cumulative_layout_shift?.percentiles?.p75),
	};
};

const parseHistory = (
	data: any,
	source: "url" | "origin",
): CruxHistoryResult => {
	const metrics = data.record.metrics;
	const collectionPeriods = data.record.collectionPeriods;

	return {
		source,
		lcp: metrics.largest_contentful_paint?.percentilesTimeseries?.p75s,
		inp: metrics.interaction_to_next_paint?.percentilesTimeseries?.p75s,
		cls: metrics.cumulative_layout_shift?.percentilesTimeseries?.p75s,
		dates: collectionPeriods.map(
			(period: { lastDate: { year: number; month: number; day: number } }) =>
				period.lastDate,
		),
	};
};

// Try the exact page first, then the whole site, otherwise no data.
export const fetchCrux = async (url: string): Promise<CruxResult | null> => {
	const byUrl = await query({ url });
	if (byUrl) return parse(byUrl, "url");

	const byOrigin = await query({ origin: new URL(url).origin });
	return byOrigin ? parse(byOrigin, "origin") : null;
};

// Collect the history data
export const fetchCruxHistory = async (
	url: string,
): Promise<CruxHistoryResult | null> => {
	const byUrl = await queryHistory({ url });
	if (byUrl) return parseHistory(byUrl, "url");

	const byOrigin = await queryHistory({ origin: new URL(url).origin });
	return byOrigin ? parseHistory(byOrigin, "origin") : null;
};
