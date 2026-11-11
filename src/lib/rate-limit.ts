type RateLimiterOptions = {
	windowMs: number;
	max: number;
};

type Entry = {
	count: number;
	resetAt: number;
};

export type HitResult = {
	allowed: boolean;
	// 0 when allowed; otherwise the milliseconds left until the window ends
	retryAfterMs: number;
};

// Once the map holds more keys than this, hit() removes the expired ones.
// There is no timer, so this is what stops the map from growing forever.
const SWEEP_THRESHOLD = 1000;

export function createRateLimiter({ windowMs, max }: RateLimiterOptions) {
	// Private state mapping keys to their respective rate limit entries
	const rateLimitMap = new Map<string, Entry>();

	function sweep(now: number): void {
		// Deleting from a Map while looping over it is safe in JavaScript
		for (const [key, entry] of rateLimitMap) {
			if (now >= entry.resetAt) rateLimitMap.delete(key);
		}
	}

	// Counts this try right away, so parallel requests cannot all slip through
	function hit(key: string): HitResult {
		const now = Date.now();
		if (rateLimitMap.size > SWEEP_THRESHOLD) sweep(now);

		const entry = rateLimitMap.get(key);

		// If there is no entry, or the window has expired, start a new entry
		if (!entry || now >= entry.resetAt) {
			rateLimitMap.set(key, {
				count: 1,
				resetAt: now + windowMs,
			});
			return { allowed: true, retryAfterMs: 0 };
		}

		// If the maximum limit is reached, block the request and return retry time.
		// The entry stays untouched, so refused tries never extend the window.
		if (entry.count >= max) {
			return {
				allowed: false,
				retryAfterMs: entry.resetAt - now,
			};
		}

		// Increment count and allow the request
		entry.count++;
		return { allowed: true, retryAfterMs: 0 };
	}

	// Gives the tries back, for example after a successful login
	function reset(key: string): void {
		rateLimitMap.delete(key);
	}

	return { hit, reset };
}
