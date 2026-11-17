import { describe, expect, it } from "vitest";
import { parseTheme, type Theme } from "./theme";

const cases: [unknown, Theme][] = [
	["light", "light"],
	["dark", "dark"],
	["system", "system"],
	[null, "system"],
	[undefined, "system"],
	["", "system"],
	["junk", "system"],
	["DARK", "system"],
];

describe("parseTheme", () => {
	it.each(cases)("parseTheme(%j) is %j", (input, expected) => {
		expect(parseTheme(input)).toBe(expected);
	});
});
