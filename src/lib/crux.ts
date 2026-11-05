import { requireEnv } from "./env";
import { CRUX_FORM_FACTOR, type Strategy } from "./strategy";

export type CruxResult = {
	source: "url" | "origin";
	lcp: number | null;
	inp: number | null;
	cls: number | null;
};

export type CruxHistoryResult = {
	source: "url" | "origin";
	lcp: (number | null)[] | null;
	inp: (number | null)[] | null;
	cls: (number | null)[] | null;
	dates: { year: number; month: number; day: number }[];
};

type CruxMetric = {
	percentiles?: { p75?: string | number };
};

type CruxResponse = {
	record: {
		metrics: {
			largest_contentful_paint?: CruxMetric;
			interaction_to_next_paint?: CruxMetric;
			cumulative_layout_shift?: CruxMetric;
		};
	};
};

type CruxHistoryMetric = {
	percentilesTimeseries?: { p75s?: (string | number | null)[] };
};

type CruxHistoryResponse = {
	record: {
		metrics: {
			largest_contentful_paint?: CruxHistoryMetric;
			interaction_to_next_paint?: CruxHistoryMetric;
			cumulative_layout_shift?: CruxHistoryMetric;
		};
		collectionPeriods: {
			lastDate: {
				year: number;
				month: number;
				day: number;
			};
		}[];
	};
};

// null/undefined -> null, otherwise a real number (CLS arrives as a string)
const toNum = (v: unknown): number | null => (v == null ? null : Number(v));

type Endpoint = "queryRecord" | "queryHistoryRecord";

// How many collection periods of history to request.
const HISTORY_PERIODS = 12;

// One CrUX request to the current-data or history endpoint. Returns the JSON,
// or null when Google has no data (404). `formFactor` is added last so that
// `body` and `extra` cannot override it.
const query = async ({
	endpoint,
	body,
	strategy,
	extra = {},
}: {
	endpoint: Endpoint;
	body: Record<string, string>;
	strategy: Strategy;
	extra?: Record<string, number>;
}) => {
	const res = await fetch(
		`https://chromeuxreport.googleapis.com/v1/records:${endpoint}?key=${requireEnv("GOOGLE_API_KEY")}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...body,
				...extra,
				formFactor: CRUX_FORM_FACTOR[strategy],
			}),
		},
	);

	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`CrUX ${res.status}: ${await res.text()}`);

	return res.json();
};

const parse = (data: CruxResponse, source: "url" | "origin"): CruxResult => {
	const metrics = data.record.metrics;

	return {
		source,
		lcp: toNum(metrics.largest_contentful_paint?.percentiles?.p75),
		inp: toNum(metrics.interaction_to_next_paint?.percentiles?.p75),
		cls: toNum(metrics.cumulative_layout_shift?.percentiles?.p75),
	};
};

const parseHistory = (
	data: CruxHistoryResponse,
	source: "url" | "origin",
): CruxHistoryResult => {
	const { metrics, collectionPeriods } = data.record;

	return {
		source,
		lcp:
			metrics.largest_contentful_paint?.percentilesTimeseries?.p75s?.map(
				toNum,
			) ?? null,
		inp:
			metrics.interaction_to_next_paint?.percentilesTimeseries?.p75s?.map(
				toNum,
			) ?? null,
		cls:
			metrics.cumulative_layout_shift?.percentilesTimeseries?.p75s?.map(
				toNum,
			) ?? null,
		dates: collectionPeriods.map(({ lastDate }) => lastDate),
	};
};

// Try the exact page first, then the whole site, otherwise no data. Errors
// other than a 404 are not caught here, so they still reach the caller.
const queryPageThenOrigin = async <T>({
	url,
	endpoint,
	strategy,
	extra,
	read,
}: {
	url: string;
	endpoint: Endpoint;
	strategy: Strategy;
	extra?: Record<string, number>;
	read: (data: any, source: "url" | "origin") => T;
}): Promise<T | null> => {
	const byUrl = await query({ endpoint, body: { url }, strategy, extra });
	if (byUrl) return read(byUrl, "url");

	const byOrigin = await query({
		endpoint,
		body: { origin: new URL(url).origin },
		strategy,
		extra,
	});
	return byOrigin ? read(byOrigin, "origin") : null;
};

// Current CrUX data for the page, falling back to the whole site.
export const fetchCrux = (
	url: string,
	strategy: Strategy,
): Promise<CruxResult | null> =>
	queryPageThenOrigin({
		url,
		endpoint: "queryRecord",
		strategy,
		read: parse,
	});

// Historical CrUX data for the page, falling back to the whole site.
export const fetchCruxHistory = (
	url: string,
	strategy: Strategy,
): Promise<CruxHistoryResult | null> =>
	queryPageThenOrigin({
		url,
		endpoint: "queryHistoryRecord",
		strategy,
		extra: { collectionPeriodCount: HISTORY_PERIODS },
		read: parseHistory,
	});
