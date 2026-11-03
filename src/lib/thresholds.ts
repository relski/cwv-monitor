export const THRESHOLDS = {
	lcp: {
		good: 2500,
		poor: 4000,
	},
	inp: {
		good: 200,
		poor: 500,
	},
	cls: {
		good: 0.1,
		poor: 0.25,
	},
	tbt: {
		good: 200,
		poor: 600,
	},
	score: {
		good: 90,
		poor: 50,
	},
} as const;
export type Metric = keyof typeof THRESHOLDS;
export type Rating = "good" | "needs-improvement" | "poor";

export function rate(metric: Metric, value: number | null): Rating | null {
	if (value === null) return null;
	const limits = THRESHOLDS[metric];

	if (metric === "score") {
		if (value >= limits.good) return "good";
		if (value >= limits.poor) return "needs-improvement";
		return "poor";
	}

	if (value <= limits.good) return "good";
	if (value <= limits.poor) return "needs-improvement";
	return "poor";
}
