import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AddSiteForm } from "#/components/add-site-form";
import { AttentionSummary } from "#/components/attention-summary";
import { SiteCards } from "#/components/site-cards";
import { SitesTable } from "#/components/sites-table";
import { StrategyToggle } from "#/components/strategy-toggle";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { useCheckAll } from "#/hooks/use-check-all";
import { countSitesByCheckStatus } from "#/lib/attention";
import { filterSites } from "#/lib/site-filter";
import { strategySearchSchema } from "#/lib/strategy";
import { listSites } from "#/server/sites";

const overviewSearchSchema = strategySearchSchema.extend({
	q: z.string().default("").catch(""),
});

export const Route = createFileRoute("/_authed/")({
	validateSearch: overviewSearchSchema,
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
	const { strategy, q } = Route.useSearch();
	const { onCheckAll, onCheckSite, checkingAll, running, checkErrors } =
		useCheckAll(sites, strategy);
	const navigate = Route.useNavigate();
	const { passing, checked, notChecked } = countSitesByCheckStatus(sites);
	const visibleSites = filterSites(sites, q);

	// summary line under the title; stays empty when the user has no sites
	let summary = "";
	if (checked > 0) {
		summary = `${passing} of ${checked} checked ${checked === 1 ? "site passes" : "sites pass"} Core Web Vitals on ${strategy}.`;
		if (notChecked > 0) {
			summary += ` ${notChecked} ${notChecked === 1 ? "site is" : "sites are"} not checked yet.`;
		}
	} else if (notChecked > 0) {
		summary = `No sites checked on ${strategy} yet.`;
	}

	return (
		<>
			<h1 className="text-2xl">Core Web Vitals Monitor</h1>
			{summary && <p className="text-on-surface-variant my-1">{summary}</p>}
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
				disabled={checkingAll || running.size > 0 || sites.length === 0}
				type="button"
			>
				{checkingAll ? "Checking…" : "Check All"}
			</Button>
			<AddSiteForm />
			<AttentionSummary sites={sites} strategy={strategy} />
			{sites.length > 0 && (
				<>
					<div className="max-w-sm">
						<Input
							type="search"
							aria-label="Filter sites by name or URL"
							placeholder="Filter sites…"
							value={q}
							onChange={(e) =>
								navigate({
									search: (prev) => ({
										...prev,
										q: e.target.value || undefined,
									}),
									replace: true,
								})
							}
						/>
					</div>

					{visibleSites.length === 0 ? (
						<p>No sites match "{q}".</p>
					) : (
						<>
							<SitesTable
								sites={visibleSites}
								strategy={strategy}
								running={running}
								checkErrors={checkErrors}
								onRecheck={onCheckSite}
							/>
							<SiteCards
								sites={visibleSites}
								strategy={strategy}
								running={running}
								checkErrors={checkErrors}
								onRecheck={onCheckSite}
							/>
						</>
					)}
				</>
			)}
		</>
	);
}
