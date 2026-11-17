import { createFileRoute } from "@tanstack/react-router";
import { AddSiteForm } from "#/components/add-site-form";
import { ManageSitesList } from "#/components/manage-sites-list";
import { DEFAULT_STRATEGY } from "#/lib/strategy";
import { listSites } from "#/server/sites";

export const Route = createFileRoute("/_authed/sites/")({
	loader: () => listSites({ data: { strategy: DEFAULT_STRATEGY } }),
	component: SitesPage,
});

function SitesPage() {
	const sites = Route.useLoaderData();

	return (
		<>
			<h1 className="text-2xl">Sites</h1>
			<AddSiteForm />
			{sites.length === 0 ? (
				<p>No sites yet. Add one above.</p>
			) : (
				<ManageSitesList sites={sites} />
			)}
		</>
	);
}
