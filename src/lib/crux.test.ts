import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCrux, fetchCruxHistory } from "./crux";

const cruxRecord = {
	record: {
		metrics: {
			largest_contentful_paint: { percentiles: { p75: 2300 } },
			interaction_to_next_paint: { percentiles: { p75: 150 } },
			cumulative_layout_shift: { percentiles: { p75: "0.05" } },
		},
	},
};

const historyRecord = {
	record: {
		metrics: {
			largest_contentful_paint: {
				percentilesTimeseries: { p75s: [2300, 2400] },
			},
			interaction_to_next_paint: {
				percentilesTimeseries: { p75s: [150, 160] },
			},
			cumulative_layout_shift: {
				percentilesTimeseries: { p75s: [0.05, 0.06] },
			},
		},
		collectionPeriods: [
			{ lastDate: { year: 2026, month: 9, day: 1 } },
			{ lastDate: { year: 2026, month: 10, day: 1 } },
		],
	},
};

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status });

let fetchMock: ReturnType<typeof vi.fn>;

// The JSON body of the nth request sent through the mocked fetch.
const requestBody = (call: number) =>
	JSON.parse(fetchMock.mock.calls[call][1].body);

beforeEach(() => {
	vi.stubEnv("GOOGLE_API_KEY", "test-key");
	fetchMock = vi.fn();
	vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe("fetchCrux", () => {
	it.each([
		["mobile", "PHONE"],
		["desktop", "DESKTOP"],
	] as const)("sends the %s strategy as %s", async (strategy, formFactor) => {
		fetchMock.mockImplementation(async () => json(cruxRecord));

		await fetchCrux("https://example.com/page", strategy);

		expect(requestBody(0).formFactor).toBe(formFactor);
	});

	it("falls back to origin data with the same form factor", async () => {
		fetchMock
			.mockImplementationOnce(async () => json({}, 404))
			.mockImplementationOnce(async () => json(cruxRecord));

		const result = await fetchCrux("https://example.com/page", "desktop");

		expect(result?.source).toBe("origin");
		expect(requestBody(0)).toMatchObject({
			url: "https://example.com/page",
			formFactor: "DESKTOP",
		});
		expect(requestBody(1)).toMatchObject({
			origin: "https://example.com",
			formFactor: "DESKTOP",
		});
	});

	it("returns null when neither the page nor the origin has data", async () => {
		fetchMock.mockImplementation(async () => json({}, 404));

		expect(await fetchCrux("https://example.com/", "mobile")).toBeNull();
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it("parses p75 values, including CLS sent as a string", async () => {
		fetchMock.mockImplementation(async () => json(cruxRecord));

		expect(await fetchCrux("https://example.com/", "mobile")).toEqual({
			source: "url",
			lcp: 2300,
			inp: 150,
			cls: 0.05,
		});
	});
});

describe("fetchCruxHistory", () => {
	it.each([
		["mobile", "PHONE"],
		["desktop", "DESKTOP"],
	] as const)("sends the %s strategy as %s", async (strategy, formFactor) => {
		fetchMock.mockImplementation(async () => json(historyRecord));

		await fetchCruxHistory("https://example.com/", strategy);

		expect(requestBody(0).formFactor).toBe(formFactor);
	});

	it("returns the timeseries with its collection dates", async () => {
		fetchMock.mockImplementation(async () => json(historyRecord));

		const result = await fetchCruxHistory("https://example.com/", "mobile");

		expect(result?.lcp).toEqual([2300, 2400]);
		expect(result?.dates).toHaveLength(2);
	});
});
