import { Link } from "@tanstack/react-router";
import { type AttentionIssue, getAttentionIssues } from "#/lib/attention";
import type { Strategy } from "#/lib/strategy";
import type { listSites } from "#/server/sites";
import { MetricValue } from "./metric-value";
import { SiteLabel } from "./site-label";

function hasPoor(issues: AttentionIssue[]) {
	return issues.some((i) => i.rating === "poor");
}

function AttentionSummary({
	sites,
	strategy,
}: {
	sites: Awaited<ReturnType<typeof listSites>>;
	strategy: Strategy;
}) {
	// without any field data, "No sites need attention" would be misleading
	const hasFieldData = sites.some(
		(site) =>
			site.latest &&
			(site.latest.fieldLcp !== null ||
				site.latest.fieldInp !== null ||
				site.latest.fieldCls !== null),
	);

	if (!hasFieldData) return null;

	const flagged = sites
		.map((site) => ({ site, issues: getAttentionIssues(site.latest) }))
		.filter((entry) => entry.issues.length > 0);

	// sites with a poor metric first
	flagged.sort((a, b) => Number(hasPoor(b.issues)) - Number(hasPoor(a.issues)));

	return (
		<section className="my-4 rounded-lg border border-outline-variant bg-card p-4">
			<h2 className="text-lg font-medium">
				Needs attention ({flagged.length})
			</h2>
			{flagged.length === 0 ? (
				<p className="mt-2 text-sm text-on-surface-variant">
					No sites need attention.
				</p>
			) : (
				<ul className="mt-3 flex flex-col gap-3">
					{flagged.map(({ site, issues }) => (
						<li key={site.id}>
							<Link
								to="/sites/$siteId"
								params={{ siteId: String(site.id) }}
								search={{ strategy }}
								className="font-semibold break-all"
								title={site.url}
							>
								<SiteLabel name={site.name} url={site.url} />
							</Link>
							<div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
								{issues.map((issue) => (
									<span
										key={issue.metric}
										className="inline-flex items-center gap-1.5"
									>
										<span className="text-xs text-on-surface-variant">
											{issue.metric.toUpperCase()}
										</span>
										<MetricValue metric={issue.metric} value={issue.value} />
									</span>
								))}
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

export { AttentionSummary };
