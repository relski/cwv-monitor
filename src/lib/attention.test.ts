import { describe, expect, it } from "vitest";
import { getAttentionIssues } from "./attention";

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
