import { describe, expect, it } from "vitest";
import {
	generateSessionToken,
	getSessionExpiry,
	hashSessionToken,
	SESSION_MAX_AGE_SECONDS,
} from "./session-token";

describe("generateSessionToken", () => {
	it("returns 64 lower-case hex characters (32 random bytes)", () => {
		expect(generateSessionToken()).toMatch(/^[0-9a-f]{64}$/);
	});

	it("gives a different token each time", () => {
		const tokens = new Set(
			Array.from({ length: 100 }, () => generateSessionToken()),
		);

		expect(tokens.size).toBe(100);
	});
});

describe("hashSessionToken", () => {
	it("gives the same hash for the same token", () => {
		const token = generateSessionToken();

		expect(hashSessionToken(token)).toBe(hashSessionToken(token));
	});

	it("returns 64 lower-case hex characters (SHA-256)", () => {
		expect(hashSessionToken(generateSessionToken())).toMatch(/^[0-9a-f]{64}$/);
	});

	it("is not equal to the token it came from", () => {
		const token = generateSessionToken();

		expect(hashSessionToken(token)).not.toBe(token);
	});

	it("gives different hashes for different tokens", () => {
		const first = generateSessionToken();
		const second = generateSessionToken();

		expect(hashSessionToken(first)).not.toBe(hashSessionToken(second));
	});

	it("matches the known SHA-256 of a fixed input", () => {
		// SHA-256 of "abc", a standard test value. This catches a wrong
		// algorithm or a wrong output format (for example base64 instead of hex).
		expect(hashSessionToken("abc")).toBe(
			"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		);
	});
});

describe("getSessionExpiry", () => {
	it("is SESSION_MAX_AGE_SECONDS after the time it is given (milliseconds)", () => {
		expect(getSessionExpiry(0).getTime()).toBe(SESSION_MAX_AGE_SECONDS * 1000);
	});

	it("adds the time on top of a given start", () => {
		const start = 1_700_000_000_000;

		expect(getSessionExpiry(start).getTime()).toBe(
			start + SESSION_MAX_AGE_SECONDS * 1000,
		);
	});

	it("is 30 days after the start", () => {
		const start = Date.UTC(2026, 0, 1);
		const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

		expect(getSessionExpiry(start).getTime() - start).toBe(thirtyDaysInMs);
	});

	it("uses the current time when no time is given", () => {
		const before = Date.now();
		const expiry = getSessionExpiry().getTime();
		const after = Date.now();

		expect(expiry).toBeGreaterThanOrEqual(
			before + SESSION_MAX_AGE_SECONDS * 1000,
		);
		expect(expiry).toBeLessThanOrEqual(after + SESSION_MAX_AGE_SECONDS * 1000);
	});
});
