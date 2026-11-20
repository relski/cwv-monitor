import { sourceLabels, timeAgo } from "#/lib/format";

function CheckedAt({
	date,
	fieldSource,
}: {
	date: Date | string;
	fieldSource: string | null;
}) {
	const d = new Date(date);
	const label = fieldSource
		? sourceLabels[fieldSource as keyof typeof sourceLabels]
		: undefined;

	return (
		<>
			<time dateTime={d.toISOString()} title={d.toLocaleString()}>
				{timeAgo(d)}
			</time>
			{label && (
				<span className="text-xs text-on-surface-variant block">
					Field: {label}
				</span>
			)}
		</>
	);
}

export { CheckedAt };
