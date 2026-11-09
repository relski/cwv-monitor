import type { Check } from "#/db/schema";
import { cn } from "#/lib/utils";

function SiteStatus({
	running,
	error,
	latest,
	className,
}: {
	running: boolean;
	error?: string;
	latest: Check | null;
	className?: string;
}) {
	let note: string | null = null;
	if (latest !== null) {
		if (latest.fieldSource === null) {
			note = "No field data";
		} else if (latest.fieldSource === "origin") {
			note = "Site-wide data";
		}
	}

	if (!running && !error && !note) return null;

	return (
		<div className={cn("flex flex-col gap-0.5 text-xs", className)}>
			{running && <span className="text-xs">Checking…</span>}
			{error && <span className="text-destructive">{error}</span>}
			{note && <span className="text-on-surface-variant">{note}</span>}
		</div>
	);
}

export { SiteStatus };
