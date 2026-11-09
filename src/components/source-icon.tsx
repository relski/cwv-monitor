import { Binoculars, FlaskConical, type LucideIcon } from "lucide-react";
import { cn } from "#/lib/utils";

const ICON: Record<
	"field" | "lab",
	{ Icon: LucideIcon; title: string; label: string }
> = {
	field: { Icon: Binoculars, title: "Real Users", label: "Field data" },
	lab: { Icon: FlaskConical, title: "Lighthouse", label: "Lab data" },
};

function SourceIcon({
	source,
	className,
}: {
	source: "field" | "lab";
	className?: string;
}) {
	const { Icon, title, label } = ICON[source];

	return (
		<span
			title={title}
			className={cn("inline-flex text-on-surface-variant", className)}
		>
			<Icon aria-hidden="true" className="size-4 shrink-0" />
			<span className="sr-only">{label}</span>
		</span>
	);
}

export { SourceIcon };
