import { cls, ms, score } from "#/lib/format";
import { type Metric, type Rating, rate } from "#/lib/thresholds";
import { StatusDot } from "./status-dot";

const FORMATTER: Record<Metric, (v: number | null) => string> = {
	lcp: ms,
	inp: ms,
	cls,
	tbt: ms,
	score,
};

const LABEL: Record<Rating, string> = {
	good: "Good",
	"needs-improvement": "Needs Improvement",
	poor: "Poor",
};

function MetricValue({
	metric,
	value,
}: {
	metric: Metric;
	value: number | null;
}) {
	const rating = rate(metric, value);
	const label = rating === null ? "No data" : LABEL[rating];

	return (
		<span className="inline-flex items-center gap-1.5 tabular-figures">
			<StatusDot rating={rating} />
			<span>{FORMATTER[metric](value)}</span>
			<span className="sr-only">{label}</span>
		</span>
	);
}

export { MetricValue };
