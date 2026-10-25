import { z } from "zod";

export const STRATEGIES = ["mobile", "desktop"] as const;

export type Strategy = (typeof STRATEGIES)[number];

export const DEFAULT_STRATEGY: Strategy = "mobile";

export const strategySchema = z.enum(STRATEGIES);

export const CRUX_FORM_FACTOR: Record<Strategy, "PHONE" | "DESKTOP"> = {
	mobile: "PHONE",
	desktop: "DESKTOP",
};