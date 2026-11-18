import { Link } from "@tanstack/react-router";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import type { Check } from "#/db/schema";
import type { Strategy } from "#/lib/strategy";
import type { Metric } from "#/lib/thresholds";
import type { listSites } from "#/server/sites";
import { MetricValue } from "./metric-value";
import { SiteLabel } from "./site-label";
import { StrategyToggle } from "./strategy-toggle";

type Column =
	| {
			kind: "metric";
			label: string;
			metric: Metric;
			getValue: (c: Check) => number | null;
	  }
	| { kind: "text"; label: string; getText: (c: Check) => string };

type SiteRow = Awaited<ReturnType<typeof listSites>>[number];

type ViewProps = {
	sites: SiteRow[];
	columns: Column[];
	strategy: Strategy;
};

function SiteLink({
	site,
	strategy,
	className,
}: {
	site: SiteRow;
	strategy: Strategy;
	className?: string;
}) {
	return (
		<Link
			to="/sites/$siteId"
			params={{ siteId: String(site.id) }}
			search={{ strategy }}
			className={className}
			title={site.url}
		>
			<SiteLabel name={site.name} url={site.url} />
		</Link>
	);
}

function CellValue({ column, latest }: { column: Column; latest: Check }) {
	if (column.kind === "text") return <>{column.getText(latest)}</>;
	return <MetricValue metric={column.metric} value={column.getValue(latest)} />;
}

function MetricsPage({
	title,
	sites,
	strategy,
	columns,
	onStrategyChange,
}: ViewProps & {
	title: string;
	onStrategyChange: (next: Strategy) => void;
}) {
	return (
		<>
			<h1 className="text-2xl">{title}</h1>
			<StrategyToggle
				value={strategy}
				onChange={onStrategyChange}
				className="my-2.5"
			/>
			<DesktopTable sites={sites} columns={columns} strategy={strategy} />
			<MobileCards sites={sites} columns={columns} strategy={strategy} />
		</>
	);
}

function DesktopTable({ sites, columns, strategy }: ViewProps) {
	return (
		<div className="rounded-lg border border-outline-variant bg-card overflow-hidden hidden md:block">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Site</TableHead>
						{columns.map((col) => (
							<TableHead key={col.label}>{col.label}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{sites.map((site) => {
						const latest = site.latest;

						if (!latest) {
							return (
								<TableRow key={site.id}>
									<TableCell>
										<SiteLink site={site} strategy={strategy} />
									</TableCell>
									<TableCell colSpan={columns.length}>
										Not checked on {strategy} yet
									</TableCell>
								</TableRow>
							);
						}

						return (
							<TableRow key={site.id}>
								<TableCell>
									<SiteLink site={site} strategy={strategy} />
								</TableCell>
								{columns.map((col) => (
									<TableCell key={col.label}>
										<CellValue column={col} latest={latest} />
									</TableCell>
								))}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

function MobileCards({ sites, columns, strategy }: ViewProps) {
	return (
		<ul className="md:hidden flex flex-col gap-4">
			{sites.map((site) => {
				const latest = site.latest;

				return (
					<li
						key={site.id}
						className="rounded-lg border border-outline-variant bg-card p-4 flex flex-col gap-3"
					>
						<SiteLink
							site={site}
							strategy={strategy}
							className="font-semibold break-all"
						/>
						{latest ? (
							<dl className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
								{columns.map((col) => (
									<div key={col.label}>
										<dt className="text-xs text-on-surface-variant">
											{col.label}
										</dt>
										<dd>
											<CellValue column={col} latest={latest} />
										</dd>
									</div>
								))}
							</dl>
						) : (
							<p className="text-xs">Not checked on {strategy} yet</p>
						)}
					</li>
				);
			})}
		</ul>
	);
}

export type { Column };
export { MetricsPage };
