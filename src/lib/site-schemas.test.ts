import { describe, expect, it } from "vitest";
import { siteNameSchema } from "./site-schemas";

const cases: [string, string | null][] = [
	["  Blog  ", "Blog"],
	["", null],
	["   ", null],
	[`  ${"a".repeat(60)}  `, "a".repeat(60)],
];

describe("siteNameSchema", () => {
	it.each(cases)("siteNameSchema(%j) is %j", (input, expected) => {
		expect(siteNameSchema.parse(input)).toBe(expected);
	});

	it("rejects names longer than 60 characters", () => {
		const result = siteNameSchema.safeParse("a".repeat(61));
		expect(result.success).toBe(false);
	});
});
