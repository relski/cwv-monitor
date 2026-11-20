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

type FieldLatest = Pick<Check, "fieldLcp" | "fieldInp" | "fieldCls">;

// True when CrUX had data for at least one of LCP, INP and CLS.
// A CLS of 0 is a real value, so compare with null instead of a falsy check.
export function hasFieldData(latest: FieldLatest): boolean {
	return (
		latest.fieldLcp !== null ||
		latest.fieldInp !== null ||
		latest.fieldCls !== null
	);
}

// Counts for the Overview summary line.
// - notChecked: no check yet on this strategy (not a failure)
// - checked: has a latest check, including one where CrUX had no data
// - passing: checked, has field data and no metric needs attention
// A checked site without field data is not passing, and is not "not checked".
export function countSitesByCheckStatus(
	sites: { latest: FieldLatest | null }[],
) {
	let passing = 0;
	let checked = 0;
	let notChecked = 0;

	for (const { latest } of sites) {
		if (latest === null) {
			notChecked++;
			continue;
		}

		checked++;
		if (hasFieldData(latest) && getAttentionIssues(latest).length === 0) {
			passing++;
		}
	}

	return { passing, checked, notChecked };
}
