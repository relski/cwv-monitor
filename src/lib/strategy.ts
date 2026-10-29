import { z } from "zod";

export const STRATEGIES = ["mobile", "desktop"] as const;

export type Strategy = (typeof STRATEGIES)[number];

export const DEFAULT_STRATEGY: Strategy = "mobile";

export const strategySchema = z.enum(STRATEGIES);

// Lenient schema for URL search params: anything missing or invalid falls
// back to the default. Server functions keep using the strict `strategySchema`.
export const strategySearchSchema = z.object({
	strategy: strategySchema.catch(DEFAULT_STRATEGY),
});

export type StrategySearch = z.infer<typeof strategySearchSchema>;

export const CRUX_FORM_FACTOR: Record<Strategy, "PHONE" | "DESKTOP"> = {
	mobile: "PHONE",
	desktop: "DESKTOP",
};
