// worker must catch its own errors
export const runQueued = async <T>(
	items: readonly T[],
	worker: (item: T) => Promise<void>,
	{ limit, startIntervalMs = 0 }: { limit: number; startIntervalMs?: number },
): Promise<void> => {
	let next = 0;
	let nextStartAt = 0;
	const n = Math.min(Math.max(1, limit), items.length);
	const runners = Array.from({ length: n }, async () => {
		while (next < items.length) {
			const item = items[next];
			next++;
			const now = Date.now();
			const startAt = Math.max(now, nextStartAt);
			nextStartAt = startAt + startIntervalMs;
			if (startAt > now) {
				await sleep(startAt - now);
			}
			await worker(item);
		}
	});
	await Promise.all(runners);
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
