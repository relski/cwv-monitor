import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

const MAX = 3;
const WINDOW_MS = 1000;

function makeLimiter() {
	return createRateLimiter({ max: MAX, windowMs: WINDOW_MS });
}

describe("createRateLimiter", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("allows the first `max` hits and answers retryAfterMs 0", () => {
		const limiter = makeLimiter();

		for (let i = 0; i < MAX; i++) {
			expect(limiter.hit("a")).toEqual({ allowed: true, retryAfterMs: 0 });
		}
	});

	it("refuses the hit after `max`", () => {
		const limiter = makeLimiter();

		for (let i = 0; i < MAX; i++) limiter.hit("a");

		expect(limiter.hit("a").allowed).toBe(false);
	});

	it("tells how long is left, and the number gets smaller as time passes", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a");

		expect(limiter.hit("a").retryAfterMs).toBe(WINDOW_MS);

		vi.advanceTimersByTime(400);

		expect(limiter.hit("a").retryAfterMs).toBe(WINDOW_MS - 400);
	});

	it("is still refused one millisecond before the window ends", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a");

		vi.advanceTimersByTime(WINDOW_MS - 1);

		const result = limiter.hit("a");
		expect(result.allowed).toBe(false);
		expect(result.retryAfterMs).toBe(1);
	});

	it("allows again when the window ends, with a fresh count", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a");

		vi.advanceTimersByTime(WINDOW_MS);

		for (let i = 0; i < MAX; i++) {
			expect(limiter.hit("a").allowed).toBe(true);
		}
		expect(limiter.hit("a").allowed).toBe(false);
	});

	it("starts the window at the first hit, not at the latest one", () => {
		const limiter = makeLimiter();

		limiter.hit("a"); // t = 0, the window starts here
		vi.advanceTimersByTime(600);
		limiter.hit("a"); // t = 600
		limiter.hit("a"); // t = 600
		expect(limiter.hit("a").allowed).toBe(false);

		vi.advanceTimersByTime(400); // t = 1000, the first window is over

		expect(limiter.hit("a").allowed).toBe(true);
	});

	it("starts a new window after the old one ends", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a");

		vi.advanceTimersByTime(WINDOW_MS + 250);
		for (let i = 0; i < MAX; i++) limiter.hit("a");

		// the new window began at t = 1250, so a full window is left
		expect(limiter.hit("a").retryAfterMs).toBe(WINDOW_MS);
	});

	it("keeps different keys apart", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a");

		expect(limiter.hit("a").allowed).toBe(false);
		expect(limiter.hit("b").allowed).toBe(true);
	});

	it("reset gives the tries back", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a");
		expect(limiter.hit("a").allowed).toBe(false);

		limiter.reset("a");

		for (let i = 0; i < MAX; i++) {
			expect(limiter.hit("a").allowed).toBe(true);
		}
	});

	it("reset only clears the key it is given", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) {
			limiter.hit("a");
			limiter.hit("b");
		}

		limiter.reset("a");

		expect(limiter.hit("a").allowed).toBe(true);
		expect(limiter.hit("b").allowed).toBe(false);
	});

	it("reset on a key that was never used does not throw", () => {
		const limiter = makeLimiter();

		expect(() => limiter.reset("never-seen")).not.toThrow();
	});

	it("refused hits do not extend the window", () => {
		const limiter = makeLimiter();
		for (let i = 0; i < MAX; i++) limiter.hit("a"); // t = 0

		vi.advanceTimersByTime(500);
		for (let i = 0; i < 10; i++) {
			expect(limiter.hit("a").allowed).toBe(false);
		}

		vi.advanceTimersByTime(500); // t = 1000, the original end

		expect(limiter.hit("a").allowed).toBe(true);
	});

	it("does not share state between two limiters", () => {
		const first = makeLimiter();
		const second = makeLimiter();
		for (let i = 0; i < MAX; i++) first.hit("a");

		expect(first.hit("a").allowed).toBe(false);
		expect(second.hit("a").allowed).toBe(true);
	});

	it("uses the max and window it was given", () => {
		const limiter = createRateLimiter({ max: 1, windowMs: 50 });

		expect(limiter.hit("a").allowed).toBe(true);
		expect(limiter.hit("a").allowed).toBe(false);

		vi.advanceTimersByTime(50);

		expect(limiter.hit("a").allowed).toBe(true);
	});
});
