import { createFileRoute, Link } from "@tanstack/react-router";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { checks } from "#/db/schema";
import type { CruxHistoryResult } from "#/lib/crux";
import { cls, ms } from "#/lib/format";
import { getSiteHistory } from "#/server/sites";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DEFAULT_STRATEGY, strategySchema } from "#/lib/strategy";
import { z } from "zod";

type Check = typeof checks.$inferSelect;

export const Route = createFileRoute("/sites/$siteId")({
	validateSearch: z.object({
		strategy: strategySchema.catch(DEFAULT_STRATEGY),
	}),
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

function HistoryTable({ history }: { history: Check[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Checked</TableHead>
					<TableHead>Field LCP</TableHead>
					<TableHead>Field INP</TableHead>
					<TableHead>Field CLS</TableHead>
					<TableHead>Lab score</TableHead>
					<TableHead>Source</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{history.map((c) => (
					<TableRow key={c.id}>
						<TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
						<TableCell>{ms(c.fieldLcp)}</TableCell>
						<TableCell>{ms(c.fieldInp)}</TableCell>
						<TableCell>{cls(c.fieldCls)}</TableCell>
						<TableCell>{c.perfScore ?? "–"}</TableCell>
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

function CruxMetricChart({
	title,
	values,
	dates,
	color,
}: {
	title: string;
	values: number[] | null;
	dates: CruxHistoryResult["dates"];
	color: string;
}) {
	const data = dates.map((date, index) => ({
		date: `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
		value: values?.[index] == null ? null : Number(values[index]),
	}));
	const config = {
		value: { label: title, color },
	} satisfies ChartConfig;

	return (
		<section>
			<h2 className="mb-2 text-lg font-medium">{title}</h2>
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
						width={56}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value: number) => String(value)}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent labelFormatter={(label) => String(label)} />
						}
					/>
					<Line
						dataKey="value"
						type="monotone"
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
	const { site, history, cruxHistory } = Route.useLoaderData();

	return (
		<main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
			<Link to="/" className="text-sm">
				← Back
			</Link>
			<h1 className="text-2xl my-5">{site.url}</h1>

			<section className="mb-8">
				<h2 className="mb-4 text-xl font-semibold">CrUX history</h2>
				{cruxHistory ? (
					<div className="grid gap-6 md:grid-cols-3">
						<CruxMetricChart
							title="LCP (ms)"
							values={cruxHistory.lcp}
							dates={cruxHistory.dates}
							color="#2563eb"
						/>
						<CruxMetricChart
							title="INP (ms)"
							values={cruxHistory.inp}
							dates={cruxHistory.dates}
							color="#16a34a"
						/>
						<CruxMetricChart
							title="CLS"
							values={cruxHistory.cls}
							dates={cruxHistory.dates}
							color="#ea580c"
						/>
					</div>
				) : (
					<p>No CrUX history available for this site.</p>
				)}
			</section>

			{history.length === 0 ? (
				<p>No checks yet.</p>
			) : (
				<HistoryTable history={history} />
			)}
		</main>
	);
}
