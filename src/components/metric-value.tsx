import { cls, ms, score, seconds } from "#/lib/format";
import { type Metric, rate } from "#/lib/thresholds";
import { StatusDot } from "./status-dot";

const FORMATTER: Record<Metric, (v: number | null) => string> = {
	lcp: seconds,
	inp: ms,
	cls,
	tbt: ms,
	score,
	fcp: seconds,
	ttfb: seconds,
	speedIndex: seconds,
};

function MetricValue({
	metric,
	value,
}: {
	metric: Metric;
	value: number | null;
}) {
	const rating = rate(metric, value);

	return (
		<span className="inline-flex items-center gap-1.5 tabular-figures">
			<StatusDot rating={rating} hideLabel />
			<span>{FORMATTER[metric](value)}</span>
		</span>
	);
}

export { MetricValue, FORMATTER };
