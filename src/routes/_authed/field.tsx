import { createFileRoute } from "@tanstack/react-router";
import { type Column, MetricsPage } from "#/components/metrics-page";
import { strategySearchSchema } from "#/lib/strategy";
import { listSites } from "#/server/sites";

export const Route = createFileRoute("/_authed/field")({
	validateSearch: strategySearchSchema,
	loaderDeps: ({ search }) => ({
		strategy: search.strategy,
	}),
	loader: ({ deps }) =>
		listSites({
			data: { strategy: deps.strategy },
		}),
	component: Field,
});

const SOURCE_LABELS: Record<string, string> = {
	url: "This page",
	origin: "Site-wide",
};

const columns: Column[] = [
	{ kind: "metric", label: "FCP", metric: "fcp", getValue: (c) => c.fieldFcp },
	{ kind: "metric", label: "LCP", metric: "lcp", getValue: (c) => c.fieldLcp },
	{ kind: "metric", label: "CLS", metric: "cls", getValue: (c) => c.fieldCls },
	{ kind: "metric", label: "INP", metric: "inp", getValue: (c) => c.fieldInp },
	{
		kind: "metric",
		label: "TTFB",
		metric: "ttfb",
		getValue: (c) => c.fieldTtfb,
	},
	{
		kind: "text",
		label: "Source",
		getText: (c) =>
			(c.fieldSource && SOURCE_LABELS[c.fieldSource]) || "No data",
	},
];

function Field() {
	const sites = Route.useLoaderData();
	const { strategy } = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<MetricsPage
			title="Field data"
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
