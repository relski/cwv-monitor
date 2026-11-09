import type { Rating } from "#/lib/thresholds";
import { cn } from "#/lib/utils";

const RATING_STYLES: Record<
	Rating | "none",
	{ className: string; label: string }
> = {
	good: { className: "bg-chart-good", label: "Good" },
	"needs-improvement": {
		className: "bg-chart-warning",
		label: "Needs improvement",
	},
	poor: { className: "bg-chart-poor", label: "Poor" },
	none: { className: "bg-chart-neutral", label: "No data" },
};

function StatusDot({
	rating,
	className,
	hideLabel,
}: {
	rating: Rating | null;
	className?: string;
	hideLabel?: boolean;
}) {
	const style = rating === null ? RATING_STYLES.none : RATING_STYLES[rating];

	return (
		<span className={cn("inline-flex items-center gap-1.5", className)}>
			<span
				aria-hidden="true"
				className={cn("size-2 shrink-0 rounded-full", style.className)}
			/>
			<span className={hideLabel ? "sr-only" : undefined}>{style.label}</span>
		</span>
	);
}

export { StatusDot };
