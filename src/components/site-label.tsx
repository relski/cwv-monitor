import { displayUrl } from "#/lib/format";

function SiteLabel({ name, url }: { name: string | null; url: string }) {
	return (
		<>
			<span className="block">{name ?? displayUrl(url)}</span>
			{name && (
				<span className="block text-xs font-normal text-on-surface-variant">
					{displayUrl(url)}
				</span>
			)}
		</>
	);
}

export { SiteLabel };
