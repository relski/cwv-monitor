import { describe, expect, it } from "vitest";
import {
	countSitesByCheckStatus,
	getAttentionIssues,
	hasFieldData,
} from "./attention";

type Latest = NonNullable<Parameters<typeof getAttentionIssues>[0]>;

// every field value starts as "no data"; each test sets only what it needs
const latest = (values: Partial<Latest> = {}): Latest => ({
	fieldLcp: null,
	fieldInp: null,
	fieldCls: null,
	...values,
});

describe("getAttentionIssues", () => {
	it("returns no issues when there is no check", () => {
		expect(getAttentionIssues(null)).toEqual([]);
	});

	it("returns no issues when there is no field data", () => {
		expect(getAttentionIssues(latest())).toEqual([]);
	});

	it("returns no issues when all three vitals are good", () => {
		expect(
			getAttentionIssues(
				latest({ fieldLcp: 1800, fieldInp: 150, fieldCls: 0.05 }),
			),
		).toEqual([]);
	});

	it("treats a CLS of 0 as a real, good value", () => {
		expect(getAttentionIssues(latest({ fieldCls: 0 }))).toEqual([]);
	});

	it("does not flag a value exactly on the good limit", () => {
		expect(getAttentionIssues(latest({ fieldLcp: 2500 }))).toEqual([]);
	});

	it("flags a value just above the good limit as needs-improvement", () => {
		expect(getAttentionIssues(latest({ fieldLcp: 2501 }))).toEqual([
			{ metric: "lcp", rating: "needs-improvement", value: 2501 },
		]);
	});

	it("flags a poor value", () => {
		expect(getAttentionIssues(latest({ fieldCls: 0.3 }))).toEqual([
			{ metric: "cls", rating: "poor", value: 0.3 },
		]);
	});

	it("returns every vital that is not good, in LCP, INP, CLS order", () => {
		expect(
			getAttentionIssues(
				latest({ fieldLcp: 3000, fieldInp: 600, fieldCls: 0.05 }),
			),
		).toEqual([
			{ metric: "lcp", rating: "needs-improvement", value: 3000 },
			{ metric: "inp", rating: "poor", value: 600 },
		]);
	});

	it("ignores a vital with no data while still flagging the others", () => {
		expect(
			getAttentionIssues(latest({ fieldLcp: null, fieldInp: 350 })),
		).toEqual([{ metric: "inp", rating: "needs-improvement", value: 350 }]);
	});
});

describe("hasFieldData", () => {
	it("is false when all three vitals have no data", () => {
		expect(hasFieldData(latest())).toBe(false);
	});

	it("is true when only one vital has a value", () => {
		expect(hasFieldData(latest({ fieldInp: 150 }))).toBe(true);
	});

	it("treats a CLS of 0 as data", () => {
		expect(hasFieldData(latest({ fieldCls: 0 }))).toBe(true);
	});
});

// a site as listSites returns it, reduced to the part the counter reads
const site = (latestCheck: Latest | null) => ({ latest: latestCheck });

describe("countSitesByCheckStatus", () => {
	it("returns zeros for an empty list", () => {
		expect(countSitesByCheckStatus([])).toEqual({
			passing: 0,
			checked: 0,
			notChecked: 0,
		});
	});

	it("counts sites without a check as not checked", () => {
		expect(countSitesByCheckStatus([site(null), site(null)])).toEqual({
			passing: 0,
			checked: 0,
			notChecked: 2,
		});
	});

	it("counts a site with all good vitals as passing", () => {
		expect(
			countSitesByCheckStatus([
				site(latest({ fieldLcp: 1800, fieldInp: 150, fieldCls: 0.05 })),
			]),
		).toEqual({ passing: 1, checked: 1, notChecked: 0 });
	});

	it("does not count a site with a poor vital as passing", () => {
		expect(countSitesByCheckStatus([site(latest({ fieldLcp: 5000 }))])).toEqual(
			{ passing: 0, checked: 1, notChecked: 0 },
		);
	});

	it("does not count a site with a needs-improvement vital as passing", () => {
		expect(countSitesByCheckStatus([site(latest({ fieldInp: 350 }))])).toEqual({
			passing: 0,
			checked: 1,
			notChecked: 0,
		});
	});

	it("counts a checked site with no field data as checked, not passing", () => {
		expect(countSitesByCheckStatus([site(latest())])).toEqual({
			passing: 0,
			checked: 1,
			notChecked: 0,
		});
	});

	it("counts a CLS of 0 with good LCP and INP as passing", () => {
		expect(
			countSitesByCheckStatus([
				site(latest({ fieldLcp: 1800, fieldInp: 150, fieldCls: 0 })),
			]),
		).toEqual({ passing: 1, checked: 1, notChecked: 0 });
	});

	it("counts a value exactly on the good limit as passing", () => {
		expect(countSitesByCheckStatus([site(latest({ fieldLcp: 2500 }))])).toEqual(
			{ passing: 1, checked: 1, notChecked: 0 },
		);
	});

	it("counts a site with data for only some vitals as passing when none is flagged", () => {
		expect(countSitesByCheckStatus([site(latest({ fieldLcp: 1800 }))])).toEqual(
			{ passing: 1, checked: 1, notChecked: 0 },
		);
	});

	it("adds up a mixed list", () => {
		const sites = [
			site(latest({ fieldLcp: 1800, fieldInp: 150, fieldCls: 0.05 })),
			site(latest({ fieldLcp: 5000 })),
			site(latest()),
			site(null),
			site(null),
		];

		const counts = countSitesByCheckStatus(sites);

		expect(counts).toEqual({ passing: 1, checked: 3, notChecked: 2 });
		expect(counts.checked + counts.notChecked).toBe(sites.length);
	});
});
