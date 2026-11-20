import { Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { Button } from "#/components/ui/button";
import { runKey } from "#/hooks/use-check-all";
import { displayUrl } from "#/lib/format";
import type { Strategy } from "#/lib/strategy";
import type { Metric } from "#/lib/thresholds";
import type { listSites } from "#/server/sites";
import { CheckedAt } from "./checked-at";
import { MetricValue } from "./metric-value";
import { SiteLabel } from "./site-label";
import { SiteStatus } from "./site-status";
import { SourceIcon } from "./source-icon";

function MetricCell({
	label,
	metric,
	value,
}: {
	label: string;
	metric: Metric;
	value: number | null;
}) {
	return (
		<div>
			<dt className="text-xs text-on-surface-variant">{label}</dt>
			<dd>
				<MetricValue metric={metric} value={value} />
			</dd>
		</div>
	);
}

function Section({
	source,
	items,
}: {
	source: "field" | "lab";
	items: { label: string; metric: Metric; value: number | null }[];
}) {
	return (
		<section>
			<div className="flex items-center gap-2">
				<SourceIcon source={source} />
				<span className="text-xs text-on-surface-variant">
					{source === "field" ? "Real Users" : "Lighthouse"}
				</span>
			</div>
			<dl className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
				{items.map((item) => (
					<MetricCell
						label={item.label}
						metric={item.metric}
						value={item.value}
						key={item.label}
					/>
				))}
			</dl>
		</section>
	);
}

function SiteCards({
	sites,
	strategy,
	running,
	checkErrors,
	onRecheck,
}: {
	sites: Awaited<ReturnType<typeof listSites>>;
	strategy: Strategy;
	running: Set<string>;
	checkErrors: Record<string, string>;
	onRecheck: (siteId: number) => void;
}) {
	return (
		<ul className="md:hidden flex flex-col gap-4">
			{sites.map((s) => {
				const key = runKey(s.id, strategy);
				const checkError = checkErrors[key];
				const isRunning = running.has(key);
				const latest = s.latest;
				const siteName = s.name ?? displayUrl(s.url);
				const fieldItems: {
					label: string;
					metric: Metric;
					value: number | null;
				}[] = [
					{ label: "FCP", metric: "fcp", value: latest?.fieldFcp ?? null },
					{ label: "LCP", metric: "lcp", value: latest?.fieldLcp ?? null },
					{ label: "CLS", metric: "cls", value: latest?.fieldCls ?? null },
					{ label: "INP", metric: "inp", value: latest?.fieldInp ?? null },
					{ label: "TTFB", metric: "ttfb", value: latest?.fieldTtfb ?? null },
				];

				const labItems: {
					label: string;
					metric: Metric;
					value: number | null;
				}[] = [
					{ label: "FCP", metric: "fcp", value: latest?.labFcp ?? null },
					{ label: "LCP", metric: "lcp", value: latest?.labLcp ?? null },
					{ label: "CLS", metric: "cls", value: latest?.labCls ?? null },
					{ label: "TBT", metric: "tbt", value: latest?.labTbt ?? null },
					{
						label: "Speed Index",
						metric: "speedIndex",
						value: latest?.labSpeedIndex ?? null,
					},
					{ label: "Score", metric: "score", value: latest?.perfScore ?? null },
				];

				return (
					<li
						key={s.id}
						className="rounded-lg border border-outline-variant bg-card p-4 flex flex-col gap-3"
					>
						<div className="flex items-start justify-between gap-2">
							<Link
								to="/sites/$siteId"
								params={{ siteId: String(s.id) }}
								search={{ strategy }}
								className="font-semibold break-all"
								title={s.url}
							>
								<SiteLabel name={s.name} url={s.url} />
							</Link>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								disabled={isRunning}
								aria-label={`${latest ? "Recheck" : "Check"} ${siteName}`}
								onClick={() => onRecheck(s.id)}
							>
								<RefreshCw
									aria-hidden="true"
									className={isRunning ? "motion-safe:animate-spin" : undefined}
								/>
							</Button>
						</div>
						<SiteStatus
							running={isRunning}
							error={checkError}
							latest={latest}
						/>
						{latest ? (
							<>
								<Section source="field" items={fieldItems} />
								<Section source="lab" items={labItems} />
								<p className="text-xs text-on-surface-variant">
									Checked{" "}
									<CheckedAt
										date={latest.createdAt}
										fieldSource={latest.fieldSource}
									/>
								</p>
							</>
						) : (
							<p className="text-xs">Not checked on {strategy} yet</p>
						)}
					</li>
				);
			})}
		</ul>
	);
}

export { SiteCards };
