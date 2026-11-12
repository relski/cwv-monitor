import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

describe("safeRedirect", () => {
	// Paths that stay on our own site must come back exactly as given.
	describe("keeps safe paths unchanged", () => {
		it.each([
			["the home page", "/"],
			["a page", "/sites/3"],
			["a query string", "/path?x=1"],
			["a hash", "/sites/3#section"],
			["a query string and a hash", "/sites/3?strategy=desktop#charts"],
			["a nested path", "/a/b/c"],
		])("%s", (_label, value) => {
			expect(safeRedirect(value)).toBe(value);
		});
	});

	// Anything that could send the person to another website becomes "/".
	describe("falls back to / for addresses that leave the site", () => {
		it.each([
			["a protocol-relative address (//)", "//evil.com"],
			["a protocol-relative address with a path", "//evil.com/sites/3"],
			["a full https address", "https://evil.com"],
			["a full http address", "http://evil.com/sites/3"],
			["a backslash after the slash", "/\\evil.com"],
			["a tab hiding a second slash", "/\t/evil.com"],
			["a line break hiding a second slash", "/\n/evil.com"],
			["a carriage return hiding a second slash", "/\r/evil.com"],
			["a javascript: address", "javascript:alert(1)"],
			["a data: address", "data:text/html,hello"],
		])("%s", (_label, value) => {
			expect(safeRedirect(value)).toBe("/");
		});
	});

	describe("falls back to / for values that are not a clean path", () => {
		it.each([
			["an empty string", ""],
			["a path without the leading slash", "sites/3"],
			["a space inside", "/ spaced"],
			["a leading space", " /sites/3"],
			["a trailing space", "/sites/3 "],
			["a tab inside", "/sites\t/3"],
			["a null character", "/sites\u00003"],
			["the DEL character", "/sites\u007f3"],
		])("%s", (_label, value) => {
			expect(safeRedirect(value)).toBe("/");
		});
	});

	describe("falls back to / when the value is not a string", () => {
		it.each([
			["undefined", undefined],
			["null", null],
			["a number", 42],
			["a boolean", true],
			["an object", {}],
			["an array holding a path", ["/"]],
		])("%s", (_label, value) => {
			expect(safeRedirect(value)).toBe("/");
		});
	});
});
