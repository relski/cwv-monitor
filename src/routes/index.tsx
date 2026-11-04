import { createFileRoute, Link } from "@tanstack/react-router";
import { Binoculars, FlaskConical } from "lucide-react";
import { AddSiteForm } from "#/components/add-site-form";
import { StrategyToggle } from "#/components/strategy-toggle";
import { Button } from "#/components/ui/button";
import type { checks } from "#/db/schema";
import { runKey, useCheckAll } from "#/hooks/use-check-all";
import { cls, ms } from "#/lib/format";
import { strategySearchSchema } from "#/lib/strategy";
import { listSites } from "#/server/sites";

type Check = typeof checks.$inferSelect;

export const Route = createFileRoute("/")({
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

function SiteResult({ latest }: { latest: Check }) {
	let fieldText: string;
	if (latest.fieldSource === null) {
		fieldText = "no data (not enough traffic)";
	} else {
		fieldText = `LCP ${ms(latest.fieldLcp)} · INP ${ms(latest.fieldInp)} · CLS ${cls(latest.fieldCls)}`;
		if (latest.fieldSource === "origin") fieldText += " (site-wide)";
	}

	return (
		<div className="text-xs mt-1.5 grow shrink-0 basis-full">
			<div className="tabular-figures flex items-center gap-2">
				<Binoculars />
				Field (real users): {fieldText}
			</div>
			<div className="tabular-figures flex items-center gap-2">
				<FlaskConical />
				Lab (Lighthouse): LCP {ms(latest.labLcp)} · TBT {ms(latest.labTbt)} ·
				CLS {cls(latest.labCls)} · score {latest.perfScore ?? "–"}
			</div>
			<div className="text-on-surface-variant tabular-figures">
				checked {new Date(latest.createdAt).toLocaleString()}
			</div>
		</div>
	);
}

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
			<ul style={{ listStyle: "none", padding: 0 }}>
				{sites.map((s) => {
					const key = runKey(s.id, strategy);
					const checkError = checkErrors[key];

					return (
						<li
							key={s.id}
							className="my-5 flex flex-wrap items-center rounded-lg border border-outline-variant bg-card p-6"
						>
							<Link
								to="/sites/$siteId"
								params={{ siteId: String(s.id) }}
								search={{ strategy }}
								className="flex-1"
							>
								<strong>{s.url}</strong>
							</Link>
							{/* Checking label */}
							{running.has(key) && <span className="text-xs">Checking…</span>}
							{/* Error */}
							{checkError && (
								<div className="text-xs text-destructive basis-full">
									{checkError}
								</div>
							)}
							{s.latest ? (
								<SiteResult latest={s.latest} />
							) : (
								<div className="text-xs mt-1.5 grow shrink-0 basis-full">
									Not checked on {strategy} yet
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</>
	);
}
