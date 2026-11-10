import { describe, expect, it } from "vitest";
import { displayUrl } from "./format";

const cases: [string, string][] = [
	["https://www.example.com/", "example.com"],
	["http://example.com/", "example.com"],
	["https://example.com/page", "example.com/page"],
	[
		"https://www.example.com/accounting/index.html",
		"example.com/accounting/index.html",
	],
	["https://example.com/page/", "example.com/page/"],
	["https://example.com/?a=1", "example.com/?a=1"],
	["https://example.com/#top", "example.com"],
	["https://sub.example.com/", "sub.example.com"],
	["https://www.example.com:8080/a", "example.com:8080/a"],
	["https://WWW.Example.com/", "example.com"],
	// no protocol: new URL() throws, so the input is returned unchanged
	["example.com", "example.com"],
];

describe("displayUrl", () => {
	it.each(cases)("displayUrl(%s) is %s", (input, expected) => {
		expect(displayUrl(input)).toBe(expected);
	});
});
