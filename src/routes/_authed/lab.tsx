import { createFileRoute } from "@tanstack/react-router";
import { type Column, MetricsPage } from "#/components/metrics-page";
import { strategySearchSchema } from "#/lib/strategy";
import { listSites } from "#/server/sites";

export const Route = createFileRoute("/_authed/lab")({
	validateSearch: strategySearchSchema,
	loaderDeps: ({ search }) => ({
		strategy: search.strategy,
	}),
	loader: ({ deps }) =>
		listSites({
			data: { strategy: deps.strategy },
		}),
	component: Lab,
});

const columns: Column[] = [
	{ kind: "metric", label: "FCP", metric: "fcp", getValue: (c) => c.labFcp },
	{ kind: "metric", label: "LCP", metric: "lcp", getValue: (c) => c.labLcp },
	{ kind: "metric", label: "CLS", metric: "cls", getValue: (c) => c.labCls },
	{ kind: "metric", label: "TBT", metric: "tbt", getValue: (c) => c.labTbt },
	{
		kind: "metric",
		label: "Speed Index",
		metric: "speedIndex",
		getValue: (c) => c.labSpeedIndex,
	},
	{
		kind: "metric",
		label: "Score",
		metric: "score",
		getValue: (c) => c.perfScore,
	},
];

function Lab() {
	const sites = Route.useLoaderData();
	const { strategy } = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<MetricsPage
			title="Lab data"
			sites={sites}
			strategy={strategy}
			columns={columns}
			onStrategyChange={(next) =>
				navigate({
					search: (prev) => ({ ...prev, strategy: next }),
					replace: true,
				})
			}
		/>
	);
}
