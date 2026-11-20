import { displayUrl } from "./format";

function filterSites<T extends { name: string | null; url: string }>(
	sites: T[],
	query: string,
): T[] {
	const q = query.trim().toLowerCase();
	if (q.length === 0) return sites;

	return sites.filter((site) => {
		return (
			site.name?.toLowerCase().includes(q) ||
			displayUrl(site.url).toLowerCase().includes(q)
		);
	});
}

export { filterSites };
