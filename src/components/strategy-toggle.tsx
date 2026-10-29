import { useId } from "react";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { STRATEGIES, type Strategy, strategySchema } from "#/lib/strategy";
import { cn } from "#/lib/utils";

const STRATEGY_LABELS: Record<Strategy, string> = {
	mobile: "Mobile",
	desktop: "Desktop",
};

function StrategyToggle({
	value,
	onChange,
	disabled,
	className,
}: {
	value: Strategy;
	onChange: (value: Strategy) => void;
	disabled?: boolean;
	className?: string;
}) {
	const id = useId();

	return (
		<RadioGroup
			aria-label="Device"
			value={value}
			onValueChange={(next) => {
				const parsed = strategySchema.safeParse(next);
				if (parsed.success) onChange(parsed.data);
			}}
			disabled={disabled}
			orientation="horizontal"
			className={cn("flex flex-row items-center gap-6", className)}
		>
			{STRATEGIES.map((strategy) => (
				<div key={strategy} className="flex items-center gap-3">
					<RadioGroupItem value={strategy} id={`${id}-${strategy}`} />
					<Label htmlFor={`${id}-${strategy}`}>
						{STRATEGY_LABELS[strategy]}
					</Label>
				</div>
			))}
		</RadioGroup>
	);
}

export { StrategyToggle };
