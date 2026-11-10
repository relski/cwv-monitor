import { createFileRoute } from "@tanstack/react-router";
import { AddSiteForm } from "#/components/add-site-form";
import { AttentionSummary } from "#/components/attention-summary";
import { SiteCards } from "#/components/site-cards";
import { SitesTable } from "#/components/sites-table";
import { StrategyToggle } from "#/components/strategy-toggle";
import { Button } from "#/components/ui/button";
import { useCheckAll } from "#/hooks/use-check-all";
import { strategySearchSchema } from "#/lib/strategy";
import { listSites } from "#/server/sites";

export const Route = createFileRoute("/_authed/")({
	validateSearch: strategySearchSchema,
	loaderDeps: ({ search }) => ({
		strategy: search.strategy,
	}),
	loader: ({ deps }) =>
		listSites({
			data: { strategy: deps.strategy },
		}),
	component: Home,
});

function Home() {
	const sites = Route.useLoaderData();
	const { strategy } = Route.useSearch();
	const { onCheckAll, checkingAll, running, checkErrors } = useCheckAll(
		sites,
		strategy,
	);
	const navigate = Route.useNavigate();

	return (
		<>
			<h1 className="text-2xl">Core Web Vitals Monitor</h1>
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
			<Button
				onClick={onCheckAll}
				disabled={checkingAll || sites.length === 0}
				type="button"
			>
				{checkingAll ? "Checking…" : "Check All"}
			</Button>
			<AddSiteForm />
			<AttentionSummary sites={sites} strategy={strategy} />
			<SitesTable
				sites={sites}
				strategy={strategy}
				running={running}
				checkErrors={checkErrors}
			/>
			<SiteCards
				sites={sites}
				strategy={strategy}
				running={running}
				checkErrors={checkErrors}
			/>
		</>
	);
}
