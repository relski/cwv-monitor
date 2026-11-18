import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { FORMATTER, MetricValue } from "#/components/metric-value";
import { SourceIcon } from "#/components/source-icon";
import { StrategyToggle } from "#/components/strategy-toggle";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/ui/chart";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import type { checks } from "#/db/schema";
import type { CruxHistoryResult } from "#/lib/crux";
import { displayUrl } from "#/lib/format";
import { strategySearchSchema } from "#/lib/strategy";
import { type Metric, type Rating, rate, THRESHOLDS } from "#/lib/thresholds";
import { getSiteHistory } from "#/server/sites";

type Check = typeof checks.$inferSelect;

export const Route = createFileRoute("/_authed/sites/$siteId")({
	validateSearch: strategySearchSchema,
	loaderDeps: ({ search }) => ({
		strategy: search.strategy,
	}),
	loader: ({ params, deps }) =>
		getSiteHistory({
			data: {
				siteId: Number(params.siteId),
				strategy: deps.strategy,
			},
		}),
	component: SitePage,
});

const sourceLabels = {
	url: "this page",
	origin: "site-wide",
} as const;

function FieldHistoryTable({ history }: { history: Check[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Checked</TableHead>
					<TableHead>FCP</TableHead>
					<TableHead>LCP</TableHead>
					<TableHead>CLS</TableHead>
					<TableHead>INP</TableHead>
					<TableHead>TTFB</TableHead>
					<TableHead>Source</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{history.map((c) => (
					<TableRow key={c.id}>
						<TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
						<TableCell>
							<MetricValue metric="fcp" value={c.fieldFcp} />
						</TableCell>
						<TableCell>
							<MetricValue metric="lcp" value={c.fieldLcp} />
						</TableCell>
						<TableCell>
							<MetricValue metric="cls" value={c.fieldCls} />
						</TableCell>
						<TableCell>
							<MetricValue metric="inp" value={c.fieldInp} />
						</TableCell>
						<TableCell>
							<MetricValue metric="ttfb" value={c.fieldTtfb} />
						</TableCell>
						<TableCell>
							{c.fieldSource
								? sourceLabels[c.fieldSource as keyof typeof sourceLabels]
								: "–"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function LabHistoryTable({ history }: { history: Check[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Checked</TableHead>
					<TableHead>FCP</TableHead>
					<TableHead>LCP</TableHead>
					<TableHead>CLS</TableHead>
					<TableHead>TBT</TableHead>
					<TableHead>Speed Index</TableHead>
					<TableHead>Score</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{history.map((c) => (
					<TableRow key={c.id}>
						<TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
						<TableCell>
							<MetricValue metric="fcp" value={c.labFcp} />
						</TableCell>
						<TableCell>
							<MetricValue metric="lcp" value={c.labLcp} />
						</TableCell>
						<TableCell>
							<MetricValue metric="cls" value={c.labCls} />
						</TableCell>
						<TableCell>
							<MetricValue metric="tbt" value={c.labTbt} />
						</TableCell>
						<TableCell>
							<MetricValue metric="speedIndex" value={c.labSpeedIndex} />
						</TableCell>
						<TableCell>
							<MetricValue metric="score" value={c.perfScore} />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

const RATING_COLOR: Record<Rating | "none", string> = {
	good: "var(--chart-good)",
	"needs-improvement": "var(--chart-warning)",
	poor: "var(--chart-poor)",
	none: "var(--chart-neutral)",
};

function CruxMetricChart({
	title,
	values,
	dates,
	metric,
}: {
	title: string;
	values: (number | null)[] | null;
	dates: CruxHistoryResult["dates"];
	metric: Metric;
}) {
	const latest = [...(values ?? [])].reverse().find((v) => v !== null) ?? null;
	const rating = rate(metric, latest);
	const color = RATING_COLOR[rating ?? "none"];
	const data = dates.map((date, index) => ({
		date: `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
		value: values?.[index],
	}));
	const config = {
		value: { label: title, color },
	} satisfies ChartConfig;

	return (
		<section className="rounded-lg border border-outline-variant bg-card p-4">
			<div className="mb-2 flex items-center justify-between gap-2">
				<h3 className="text-lg font-medium">{title}</h3>
				<MetricValue metric={metric} value={latest} />
			</div>
			<ChartContainer config={config} className="min-h-56 w-full">
				<LineChart
					accessibilityLayer
					data={data}
					margin={{ left: 8, right: 8 }}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="date"
						tickLine={false}
						axisLine={false}
						minTickGap={32}
					/>
					<YAxis
						width={64}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value: number) => FORMATTER[metric](value)}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								className="border-outline-variant bg-surface-container-high shadow-none"
								labelFormatter={(label) => String(label)}
							/>
						}
					/>
					<ReferenceLine
						y={THRESHOLDS[metric].good}
						stroke="var(--chart-neutral)"
						strokeDasharray="4 4"
						strokeWidth={1}
						ifOverflow="extendDomain"
					/>
					<ReferenceLine
						y={THRESHOLDS[metric].poor}
						stroke="var(--chart-neutral)"
						strokeDasharray="4 4"
						strokeWidth={1}
					/>
					<Line
						dataKey="value"
						type="linear"
						stroke="var(--color-value)"
						strokeWidth={2}
						dot={false}
						connectNulls={false}
					/>
				</LineChart>
			</ChartContainer>
		</section>
	);
}

function SitePage() {
	const { site, history, cruxHistory, cruxHistoryFailed } =
		Route.useLoaderData();
	const { strategy } = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<>
			<Link to="/" className="text-sm" search={{ strategy }}>
				← Back
			</Link>
			<div className="my-5">
				<h1 className="text-2xl" title={site.url}>
					{site.name ?? displayUrl(site.url)}
				</h1>
				{site.name && (
					<p className="text-sm text-on-surface-variant">
						{displayUrl(site.url)}
					</p>
				)}
			</div>
			<StrategyToggle
				value={strategy}
				onChange={(next) =>
					navigate({
						search: (prev) => ({ ...prev, strategy: next }),
						replace: true,
					})
				}
				className="my-2.5"
			/>
			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">CrUX history</h2>
				{cruxHistory ? (
					<div className="grid gap-6 md:grid-cols-3">
						<CruxMetricChart
							title="LCP"
							values={cruxHistory.lcp}
							dates={cruxHistory.dates}
							metric="lcp"
						/>
						<CruxMetricChart
							title="INP"
							values={cruxHistory.inp}
							dates={cruxHistory.dates}
							metric="inp"
						/>
						<CruxMetricChart
							title="CLS"
							values={cruxHistory.cls}
							dates={cruxHistory.dates}
							metric="cls"
						/>
					</div>
				) : cruxHistoryFailed ? (
					<p>Couldn’t load CrUX history. Try reloading the page.</p>
				) : (
					<p>No CrUX history available for {strategy} on this site.</p>
				)}
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold">
					Saved checks ({strategy})
				</h2>
				{history.length === 0 ? (
					<p>No {strategy} checks yet. Run one from the home page.</p>
				) : (
					<div className="flex flex-col gap-8">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<SourceIcon source="field" />
								<h3 className="text-lg font-medium">Field data (real users)</h3>
							</div>
							<FieldHistoryTable history={history} />
						</div>
						<div>
							<div className="mb-2 flex items-center gap-2">
								<SourceIcon source="lab" />
								<h3 className="text-lg font-medium">Lab data (Lighthouse)</h3>
							</div>
							<LabHistoryTable history={history} />
						</div>
					</div>
				)}
			</section>
		</>
	);
}
