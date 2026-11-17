import { Link, useRouter } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { DEFAULT_STRATEGY } from "#/lib/strategy";
import { deleteSite, type listSites, renameSite } from "#/server/sites";
import { SiteLabel } from "./site-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type SiteRow = Awaited<ReturnType<typeof listSites>>[number];

function ManageSitesList({
	sites,
}: {
	sites: Awaited<ReturnType<typeof listSites>>;
}) {
	return (
		<ul className="flex flex-col gap-3">
			{sites.map((site) => (
				<ManageSiteRow key={site.id} site={site} />
			))}
		</ul>
	);
}

function ManageSiteRow({ site }: { site: SiteRow }) {
	const [mode, setMode] = useState<"view" | "rename" | "confirm-delete">(
		"view",
	);
	const [draft, setDraft] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	async function handleRename(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			await renameSite({ data: { siteId: site.id, name: draft } });
			await router.invalidate();
			setMode("view");
		} catch {
			setError("Could not rename the site.");
		} finally {
			setBusy(false);
		}
	}

	async function handleDelete() {
		setBusy(true);
		setError("");
		try {
			await deleteSite({ data: { siteId: site.id } });
			await router.invalidate();
		} catch {
			setError("Could not delete the site.");
		} finally {
			setBusy(false);
		}
	}

	return (
		<li className="rounded-lg border border-outline-variant bg-card p-4">
			<Link
				to="/sites/$siteId"
				params={{ siteId: String(site.id) }}
				search={{ strategy: DEFAULT_STRATEGY }}
			>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<SiteLabel name={site.name} url={site.url} />
					<span className="text-xs text-on-surface-variant">
						Added: {new Date(site.createdAt).toLocaleDateString()}
					</span>
				</div>
			</Link>
			{mode === "view" && (
				<div className="mt-3 flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setDraft(site.name ?? "");
							setMode("rename");
						}}
						aria-label={`Rename ${site.name ?? site.url}`}
					>
						Rename
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setMode("confirm-delete");
						}}
						aria-label={`Delete ${site.name ?? site.url}`}
					>
						Delete
					</Button>
				</div>
			)}
			{mode === "rename" && (
				<form onSubmit={handleRename} className="mt-3 flex flex-wrap gap-2">
					<Input
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						maxLength={60}
						aria-label="Site name"
						placeholder="Leave empty to remove the name"
						className="min-w-48 flex-1"
					/>
					<Button type="submit" size="sm" disabled={busy}>
						Save
					</Button>
					<Button
						variant="outline"
						type="button"
						size="sm"
						onClick={() => {
							setMode("view");
							setError("");
						}}
					>
						Cancel
					</Button>
				</form>
			)}
			{mode === "confirm-delete" && (
				<div className="mt-3 flex flex-wrap items-center gap-2">
					<p>Delete this site? Its saved checks are deleted too.</p>
					<Button
						variant="destructive"
						size="sm"
						disabled={busy}
						onClick={handleDelete}
					>
						Delete
					</Button>
					<Button
						variant="outline"
						type="button"
						size="sm"
						disabled={busy}
						onClick={() => {
							setMode("view");
							setError("");
						}}
					>
						Cancel
					</Button>
				</div>
			)}
			{error && <p className="text-destructive">{error}</p>}
		</li>
	);
}

export { ManageSitesList };
