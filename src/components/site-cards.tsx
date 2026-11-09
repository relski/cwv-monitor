import { Link } from "@tanstack/react-router";
import { runKey } from "#/hooks/use-check-all";
import type { Strategy } from "#/lib/strategy";
import type { Metric } from "#/lib/thresholds";
import type { listSites } from "#/server/sites";
import { MetricValue } from "./metric-value";
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
}: {
	sites: Awaited<ReturnType<typeof listSites>>;
	strategy: Strategy;
	running: Set<string>;
	checkErrors: Record<string, string>;
}) {
	return (
		<ul className="md:hidden flex flex-col gap-4">
			{sites.map((s) => {
				const key = runKey(s.id, strategy);
				const checkError = checkErrors[key];
				const latest = s.latest;
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
						<Link
							to="/sites/$siteId"
							params={{ siteId: String(s.id) }}
							search={{ strategy }}
							className="font-semibold break-all"
						>
							{s.url}
						</Link>
						<SiteStatus
							running={running.has(key)}
							error={checkError}
							latest={latest}
						/>
						{latest ? (
							<>
								<Section source="field" items={fieldItems} />
								<Section source="lab" items={labItems} />
								<p className="text-xs text-on-surface-variant">
									Checked {new Date(latest.createdAt).toLocaleString()}
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
