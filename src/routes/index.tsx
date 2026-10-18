import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { cls, ms } from "#/lib/format";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { checks } from "../db/schema";
import { runCheck } from "../server/checks";
import { addSite, listSites } from "../server/sites";

type Check = typeof checks.$inferSelect;

export const Route = createFileRoute("/")({
	loader: () => listSites(),
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

function Home() {
	const sites = Route.useLoaderData();
	const router = useRouter();
	const [error, setError] = useState("");
	const [running, setRunning] = useState<number | null>(null);

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

	async function onCheck(siteId: number) {
		setError("");
		setRunning(siteId);
		try {
			await runCheck({ data: { siteId } });
			router.invalidate();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Check failed");
		} finally {
			setRunning(null);
		}
	}

	return (
		<main style={{ maxWidth: 1200, margin: "40px auto", padding: 16 }}>
			<h1 className="text-2xl">CWV Monitor</h1>
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
										errors={field.state.meta.errors.map((error) => ({
											message: String(error),
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
				{sites.map((s) => (
					<li
						key={s.id}
						className="my-5 p-4 flex flex-wrap items-center bg-zinc-100"
					>
						<Link
							to="/sites/$siteId"
							params={{ siteId: String(s.id) }}
							className="flex-1"
						>
							<strong>{s.url}</strong>
						</Link>
						<Button
							onClick={() => onCheck(s.id)}
							disabled={running === s.id}
							className="flex-1 max-w-30"
						>
							{running === s.id ? "Checking… (can take ~30s)" : "Check now"}
						</Button>
						{s.latest ? (
							<SiteResult latest={s.latest} />
						) : (
							<div className="text-xs mt-1.5 grow shrink-0 basis-full">
								Not checked yet
							</div>
						)}
					</li>
				))}
			</ul>
		</main>
	);
}
