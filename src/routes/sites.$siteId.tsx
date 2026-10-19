import { createFileRoute, Link } from "@tanstack/react-router";
import type { checks } from "#/db/schema";
import { cls, ms } from "#/lib/format";
import { getSiteHistory } from "#/server/sites";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Check = typeof checks.$inferSelect;

export const Route = createFileRoute("/sites/$siteId")({
	loader: ({ params }) =>
		getSiteHistory({ data: { siteId: Number(params.siteId) } }),
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

function SitePage() {
	const { site, history } = Route.useLoaderData();

	return (
		<main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
			<Link to="/" className="text-sm">
				← Back
			</Link>
			<h1 className="text-2xl my-5">{site.url}</h1>

			{history.length === 0 ? (
				<p>No checks yet.</p>
			) : (
				<HistoryTable history={history} />
			)}
		</main>
	);
}
