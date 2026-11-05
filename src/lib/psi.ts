import { requireEnv } from "./env";
import type { Strategy } from "./strategy";

export type PsiResult = {
	lcp: number | null;
	cls: number | null;
	tbt: number | null;
	score: number | null;
};

type PsiAudit = {
	numericValue?: number;
};

// Only the parts of the PageSpeed Insights response that fetchPsi reads.
type PsiResponse = {
	lighthouseResult: {
		audits: Record<string, PsiAudit | undefined>;
		categories: {
			performance: {
				score?: number | null; // 0-1
			};
		};
	};
};

export const fetchPsi = async (
	url: string,
	strategy: Strategy,
): Promise<PsiResult> => {
	const params = new URLSearchParams({
		url,
		strategy,
		category: "performance",
		key: requireEnv("GOOGLE_API_KEY"),
	});

	const res = await fetch(
		`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
	);
	if (!res.ok) throw new Error(`PSI ${res.status}: ${await res.text()}`);

	const data: PsiResponse = await res.json();
	const lighthouse = data.lighthouseResult;
	const audits = lighthouse.audits;
	const score = lighthouse.categories.performance.score; // 0-1

	return {
		lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
		cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
		tbt: audits["total-blocking-time"]?.numericValue ?? null,
		score: score == null ? null : Math.round(score * 100),
	};
};
