import { useId, useSyncExternalStore } from "react";
import {
	applyTheme,
	getStoredTheme,
	subscribeToTheme,
	THEMES,
	type Theme,
	themeSchema,
} from "#/lib/theme";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const THEME_LABELS: Record<Theme, string> = {
	light: "Light",
	dark: "Dark",
	system: "System",
};

function ThemePicker() {
	const id = useId();
	const theme = useSyncExternalStore(
		subscribeToTheme,
		() => getStoredTheme(),
		() => "system",
	);

	return (
		<RadioGroup
			aria-label="Theme"
			value={theme}
			onValueChange={(next) => applyTheme(themeSchema.parse(next))}
		>
			{THEMES.map((option) => (
				<div key={option} className="flex items-center gap-3">
					<RadioGroupItem value={option} id={`${id}-${option}`} />
					<Label htmlFor={`${id}-${option}`}>{THEME_LABELS[option]}</Label>
				</div>
			))}
		</RadioGroup>
	);
}

export { ThemePicker };
