import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { StrategyToggle } from "#/components/strategy-toggle";
import type { checks } from "#/db/schema";
import { runQueued } from "#/lib/concurrency";
import { cls, ms } from "#/lib/format";
import { strategySearchSchema } from "#/lib/strategy";
import { runCheck } from "#/server/checks";
import { addSite, listSites } from "#/server/sites";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Check = typeof checks.$inferSelect;

function runKey(siteId: number, strategy: string): string {
	return `${siteId}:${strategy}`;
}

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
			<div>Field (real users): {fieldText}</div>
			<div>
				Lab (Lighthouse): LCP {ms(latest.labLcp)} · TBT {ms(latest.labTbt)} ·
				CLS {cls(latest.labCls)} · score {latest.perfScore ?? "–"}
			</div>
			<div style={{ color: "#888" }}>
				checked {new Date(latest.createdAt).toLocaleString()}
			</div>
		</div>
	);
}

const MAX_IN_FLIGHT = 3;
const START_SPACING_MS = 100;

function Home() {
	const sites = Route.useLoaderData();
	const router = useRouter();
	const [error, setError] = useState("");
	const [running, setRunning] = useState<Set<string>>(() => new Set());
	const [checkingAll, setCheckingAll] = useState(false);
	const { strategy } = Route.useSearch();
	const navigate = Route.useNavigate();
	const ref = useRef(false);
	const [checkErrors, setCheckErrors] = useState<Record<string, string>>({});

	const form = useForm({
		defaultValues: {
			url: "",
		},
		onSubmit: async ({ value }) => {
			setError("");
			try {
				await addSite({ data: { url: value.url } });
				form.reset();
				router.invalidate();
			} catch {
				setError("Enter a valid URL, including https://");
			}
		},
	});

	async function onCheckAll() {
		if (sites.length === 0 || ref.current) return;
		ref.current = true;
		setCheckingAll(true);
		setError("");

		const runStrategy = strategy;
		const runSites = sites;

		setRunning((previous) => {
			const next = new Set(previous);
			for (const site of runSites) {
				next.add(runKey(site.id, runStrategy));
			}
			return next;
		});

		setCheckErrors((previous) => {
			const next = { ...previous };

			for (const site of runSites) {
				delete next[runKey(site.id, runStrategy)];
			}

			return next;
		});

		const worker = async (site: (typeof runSites)[number]) => {
			const key = runKey(site.id, runStrategy);

			try {
				try {
					await runCheck({ data: { siteId: site.id, strategy: runStrategy } });
				} catch (e) {
					const message = e instanceof Error ? e.message : "Check failed";

					setCheckErrors((previous) => ({
						...previous,
						[key]: message,
					}));

					return;
				}

				// The check succeeded, so remove any previous check error.
				setCheckErrors((previous) => {
					const next = { ...previous };
					delete next[key];
					return next;
				});

				try {
					await router.invalidate();
				} catch (e) {
					// Keep refresh failures distinct from check failures.
					const message =
						e instanceof Error
							? `Check succeeded, but refreshing results failed: ${e.message}`
							: "Check succeeded, but refreshing results failed";

					setCheckErrors((previous) => ({
						...previous,
						[key]: message,
					}));
				}
			} finally {
				setRunning((previous) => {
					const next = new Set(previous);
					next.delete(key);
					return next;
				});
			}
		};

		try {
			await runQueued(runSites, worker, {
				limit: MAX_IN_FLIGHT,
				startIntervalMs: START_SPACING_MS,
			});
		} finally {
			ref.current = false;
			setCheckingAll(false);
		}
	}

	return (
		<main style={{ maxWidth: 1200, margin: "40px auto", padding: 16 }}>
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
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="my-5"
			>
				<FieldGroup>
					<form.Field
						name="url"
						validators={{
							onChange: ({ value }) =>
								value && !/^https?:\/\/.+/.test(value)
									? "Enter a valid URL"
									: undefined,
						}}
					>
						{(field) => (
							<Field orientation="horizontal" className="flex flex-wrap">
								<Input
									id={field.name}
									name={field.name}
									type="url"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="https://example.com"
									className="flex-1"
								/>
								<Button type="submit">Add</Button>
								{field.state.meta.errors.length > 0 && (
									<FieldError
										errors={field.state.meta.errors.map((err) => ({
											message: String(err),
										}))}
									/>
								)}
							</Field>
						)}
					</form.Field>
				</FieldGroup>
			</form>
			{error && <p style={{ color: "crimson" }}>{error}</p>}

			<ul style={{ listStyle: "none", padding: 0 }}>
				{sites.map((s) => {
					const key = runKey(s.id, strategy);
					const checkError = checkErrors[key];

					return (
						<li
							key={s.id}
							className="my-5 p-4 flex flex-wrap items-center bg-zinc-100"
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
								<div className="text-xs text-red-600 basis-full">
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
		</main>
	);
}
