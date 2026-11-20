import { describe, expect, it } from "vitest";
import { displayUrl, timeAgo } from "./format";

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

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// a fixed "now" keeps these tests the same on every day
const now = new Date("2026-11-20T12:00:00Z");
const ago = (ms: number) => new Date(now.getTime() - ms);

const timeAgoCases: { label: string; date: Date; expected: string }[] = [
	{ label: "0 seconds", date: ago(0), expected: "just now" },
	{ label: "59 seconds", date: ago(59 * SECOND), expected: "just now" },
	{ label: "60 seconds", date: ago(60 * SECOND), expected: "1m ago" },
	{
		label: "59 minutes 59 seconds",
		date: ago(59 * MINUTE + 59 * SECOND),
		expected: "59m ago",
	},
	{ label: "60 minutes", date: ago(60 * MINUTE), expected: "1h ago" },
	{
		label: "23 hours 59 minutes",
		date: ago(23 * HOUR + 59 * MINUTE),
		expected: "23h ago",
	},
	{ label: "24 hours", date: ago(24 * HOUR), expected: "1d ago" },
	{ label: "29 days", date: ago(29 * DAY), expected: "29d ago" },
	{ label: "30 days", date: ago(30 * DAY), expected: "1mo ago" },
	{ label: "59 days", date: ago(59 * DAY), expected: "1mo ago" },
	{ label: "60 days", date: ago(60 * DAY), expected: "2mo ago" },
	// a date slightly in the future (clock differences) must not show a negative time
	{
		label: "5 minutes in the future",
		date: ago(-5 * MINUTE),
		expected: "just now",
	},
];

describe("timeAgo", () => {
	it.each(timeAgoCases)("$label ago gives $expected", ({ date, expected }) => {
		expect(timeAgo(date, now)).toBe(expected);
	});

	it("accepts an ISO string and gives the same text as the matching Date", () => {
		const date = ago(2 * HOUR);

		expect(timeAgo(date.toISOString(), now)).toBe(timeAgo(date, now));
		expect(timeAgo(date.toISOString(), now)).toBe("2h ago");
	});

	it("uses the current time when now is left out", () => {
		expect(timeAgo(new Date())).toBe("just now");
	});
});
