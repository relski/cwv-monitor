import { describe, expect, it } from "vitest";
import {
	CRUX_FORM_FACTOR,
	DEFAULT_STRATEGY,
	strategySchema,
	strategySearchSchema,
} from "./strategy";

describe("strategySearchSchema", () => {
	it("keeps a valid strategy", () => {
		expect(strategySearchSchema.parse({ strategy: "desktop" })).toEqual({
			strategy: "desktop",
		});
	});

	it.each([
		["missing", {}],
		["an unknown string", { strategy: "tablet" }],
		["the wrong type", { strategy: 42 }],
	])("falls back to the default when strategy is %s", (_label, input) => {
		expect(strategySearchSchema.parse(input)).toEqual({
			strategy: DEFAULT_STRATEGY,
		});
	});
});

describe("strategySchema", () => {
	it("accepts the known strategies", () => {
		expect(strategySchema.parse("mobile")).toBe("mobile");
		expect(strategySchema.parse("desktop")).toBe("desktop");
	});

	it("rejects anything else, with no fallback", () => {
		expect(strategySchema.safeParse("tablet").success).toBe(false);
	});
});

describe("CRUX_FORM_FACTOR", () => {
	it("maps each strategy to its CrUX form factor", () => {
		expect(CRUX_FORM_FACTOR).toEqual({
			mobile: "PHONE",
			desktop: "DESKTOP",
		});
	});
});
