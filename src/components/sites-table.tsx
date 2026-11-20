import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { Button } from "#/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { runKey } from "#/hooks/use-check-all";
import { displayUrl } from "#/lib/format";
import type { Strategy } from "#/lib/strategy";
import type { listSites } from "#/server/sites";
import { CheckedAt } from "./checked-at";
import { MetricValue } from "./metric-value";
import { SiteLabel } from "./site-label";
import { SiteStatus } from "./site-status";
import { SourceIcon } from "./source-icon";

function RecheckButton({
	label,
	siteName,
	disabled,
	onClick,
}: {
	label: string;
	siteName: string;
	disabled: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			disabled={disabled}
			aria-label={`${label} ${siteName}`}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}

function SitesTable({
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
		<div className="rounded-lg border border-outline-variant bg-card overflow-hidden hidden md:block">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Site</TableHead>
						<TableHead></TableHead>
						<TableHead>FCP</TableHead>
						<TableHead>LCP</TableHead>
						<TableHead>CLS</TableHead>
						<TableHead>INP / TBT</TableHead>
						<TableHead>TTFB / Speed Index</TableHead>
						<TableHead>Score</TableHead>
						<TableHead>Last Checked</TableHead>
						<TableHead>
							<span className="sr-only">Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sites.map((s) => {
						const key = runKey(s.id, strategy);
						const checkError = checkErrors[key];

						if (!s.latest) {
							return (
								<TableRow key={s.id}>
									<TableCell>
										<Link
											to="/sites/$siteId"
											params={{ siteId: String(s.id) }}
											search={{ strategy }}
											title={s.url}
										>
											<SiteLabel name={s.name} url={s.url} />
										</Link>
										<SiteStatus
											running={running.has(key)}
											error={checkError}
											latest={s.latest}
										/>
									</TableCell>
									<TableCell colSpan={8}>
										Not checked on {strategy} yet
									</TableCell>
									<TableCell>
										<RecheckButton
											label="Recheck"
											siteName={s.name ?? displayUrl(s.url)}
											disabled={running.has(key)}
											onClick={() => onRecheck(s.id)}
										/>
									</TableCell>
								</TableRow>
							);
						}

						return (
							<Fragment key={s.id}>
								{/* Field Row */}
								<TableRow className="border-b-0">
									<TableCell rowSpan={2}>
										<Link
											to="/sites/$siteId"
											params={{ siteId: String(s.id) }}
											search={{ strategy }}
											title={s.url}
										>
											<SiteLabel name={s.name} url={s.url} />
										</Link>
										<SiteStatus
											running={running.has(key)}
											error={checkError}
											latest={s.latest}
										/>
									</TableCell>
									<TableCell>
										<SourceIcon source="field" />
									</TableCell>
									<TableCell>
										<MetricValue
											metric="fcp"
											value={s.latest.fieldFcp ?? null}
										/>
									</TableCell>
									<TableCell>
										<MetricValue
											metric="lcp"
											value={s.latest.fieldLcp ?? null}
										/>
									</TableCell>
									<TableCell>
										<MetricValue
											metric="cls"
											value={s.latest.fieldCls ?? null}
										/>
									</TableCell>
									<TableCell>
										<MetricValue
											metric="inp"
											value={s.latest.fieldInp ?? null}
										/>
									</TableCell>
									<TableCell>
										<MetricValue
											metric="ttfb"
											value={s.latest.fieldTtfb ?? null}
										/>
									</TableCell>
									<TableCell></TableCell>
									<TableCell rowSpan={2}>
										<CheckedAt
											date={s.latest.createdAt}
											fieldSource={s.latest.fieldSource}
										/>
									</TableCell>
									<TableCell rowSpan={2}>
										<RecheckButton
											label="Recheck"
											siteName={s.name ?? displayUrl(s.url)}
											disabled={running.has(key)}
											onClick={() => onRecheck(s.id)}
										/>
									</TableCell>
								</TableRow>
								{/* Lab Row */}
								<TableRow>
									<TableCell>
										<SourceIcon source="lab" />
									</TableCell>
									<TableCell>
										<MetricValue metric="fcp" value={s.latest.labFcp ?? null} />
									</TableCell>
									<TableCell>
										<MetricValue metric="lcp" value={s.latest.labLcp ?? null} />
									</TableCell>
									<TableCell>
										<MetricValue metric="cls" value={s.latest.labCls ?? null} />
									</TableCell>
									<TableCell>
										<MetricValue metric="tbt" value={s.latest.labTbt ?? null} />
									</TableCell>
									<TableCell>
										<MetricValue
											metric="speedIndex"
											value={s.latest.labSpeedIndex ?? null}
										/>
									</TableCell>
									<TableCell>
										<MetricValue
											metric="score"
											value={s.latest.perfScore ?? null}
										/>
									</TableCell>
								</TableRow>
							</Fragment>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export { SitesTable };
