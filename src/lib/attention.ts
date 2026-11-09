import type { Check } from "#/db/schema";
import { type Metric, type Rating, rate } from "./thresholds";

export type AttentionIssue = {
	metric: Metric;
	rating: Rating;
	value: number;
};

// Core Web Vitals (field data) that are not rated "good" in a site's latest check
export function getAttentionIssues(
	latest: Pick<Check, "fieldLcp" | "fieldInp" | "fieldCls"> | null,
): AttentionIssue[] {
	if (!latest) return [];

	const pairs: [Metric, number | null][] = [
		["lcp", latest.fieldLcp],
		["inp", latest.fieldInp],
		["cls", latest.fieldCls],
	];
	const issues: AttentionIssue[] = [];

	for (const [metric, value] of pairs) {
		// a CLS of 0 is a perfect score, so don't use a falsy check
		if (value === null) continue;

		const rating = rate(metric, value);
		if (rating === "needs-improvement" || rating === "poor") {
			issues.push({ metric, rating, value });
		}
	}

	return issues;
}
