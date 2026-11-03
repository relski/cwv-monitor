import type { Rating } from "#/lib/thresholds";
import { cn } from "#/lib/utils";

const DOT_COLORS: Record<Rating, string> = {
	good: "bg-chart-good",
	"needs-improvement": "bg-chart-warning",
	poor: "bg-chart-poor",
};

function StatusDot({
	rating,
	className,
}: {
	rating: Rating | null;
	className?: string;
}) {
	const color = rating === null ? "bg-chart-neutral" : DOT_COLORS[rating];

	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-block size-2 shrink-0 rounded-full",
				color,
				className,
			)}
		/>
	);
}

export { StatusDot };
