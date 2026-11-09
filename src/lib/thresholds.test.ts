import { describe, expect, it } from "vitest";
import { type Metric, type Rating, rate } from "./thresholds";

const cases: [Metric, number, Rating][] = [
	// LCP (ms)
	["lcp", 1000, "good"],
	["lcp", 2500, "good"],
	["lcp", 2501, "needs-improvement"],
	["lcp", 3000, "needs-improvement"],
	["lcp", 4000, "needs-improvement"],
	["lcp", 4001, "poor"],
	["lcp", 6000, "poor"],

	// INP (ms)
	["inp", 100, "good"],
	["inp", 200, "good"],
	["inp", 201, "needs-improvement"],
	["inp", 350, "needs-improvement"],
	["inp", 500, "needs-improvement"],
	["inp", 501, "poor"],
	["inp", 800, "poor"],

	// CLS (unitless)
	["cls", 0, "good"],
	["cls", 0.05, "good"],
	["cls", 0.1, "good"],
	["cls", 0.11, "needs-improvement"],
	["cls", 0.2, "needs-improvement"],
	["cls", 0.25, "needs-improvement"],
	["cls", 0.26, "poor"],
	["cls", 0.5, "poor"],

	// TBT (ms)
	["tbt", 120, "good"],
	["tbt", 200, "good"],
	["tbt", 201, "needs-improvement"],
	["tbt", 350, "needs-improvement"],
	["tbt", 600, "needs-improvement"],
	["tbt", 601, "poor"],
	["tbt", 800, "poor"],

	// FCP (ms)
	["fcp", 1000, "good"],
	["fcp", 1800, "good"],
	["fcp", 1801, "needs-improvement"],
	["fcp", 2500, "needs-improvement"],
	["fcp", 3000, "needs-improvement"],
	["fcp", 3001, "poor"],
	["fcp", 4500, "poor"],

	// TTFB (ms)
	["ttfb", 500, "good"],
	["ttfb", 800, "good"],
	["ttfb", 801, "needs-improvement"],
	["ttfb", 1200, "needs-improvement"],
	["ttfb", 1800, "needs-improvement"],
	["ttfb", 1801, "poor"],
	["ttfb", 2500, "poor"],

	// Speed Index (ms)
	["speedIndex", 2000, "good"],
	["speedIndex", 3400, "good"],
	["speedIndex", 3401, "needs-improvement"],
	["speedIndex", 4500, "needs-improvement"],
	["speedIndex", 5800, "needs-improvement"],
	["speedIndex", 5801, "poor"],
	["speedIndex", 7000, "poor"],

	// Score (0–100)
	["score", 100, "good"],
	["score", 90, "good"],
	["score", 89, "needs-improvement"],
	["score", 75, "needs-improvement"],
	["score", 50, "needs-improvement"],
	["score", 49, "poor"],
	["score", 25, "poor"],
	["score", 0, "poor"],
];

describe("rate", () => {
	it.each(cases)("rate(%s, %s) is %s", (metric, value, expected) => {
		expect(rate(metric, value)).toBe(expected);
	});

	const metrics: Metric[] = [
		"lcp",
		"inp",
		"cls",
		"tbt",
		"score",
		"fcp",
		"ttfb",
		"speedIndex",
	];

	it.each(metrics)("rate(%s, null) is null", (metric) => {
		expect(rate(metric, null)).toBeNull();
	});
});
