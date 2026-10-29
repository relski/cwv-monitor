import { afterEach, describe, expect, it, vi } from "vitest";
import { runQueued } from "./concurrency";

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function createGate() {
	let open!: () => void;
	const promise = new Promise<void>((resolve) => {
		open = resolve;
	});
	return { promise, open };
}

describe("runQueued", () => {
	it("runs the worker once for every item", async () => {
		const items = [1, 2, 3, 4, 5];
		const seen: number[] = [];

		await runQueued(
			items,
			async (item) => {
				seen.push(item);
			},
			{ limit: 2 },
		);

		expect(seen.sort((a, b) => a - b)).toEqual(items);
	});

	it("never runs more workers at once than the limit", async () => {
		const items = [1, 2, 3, 4, 5, 6, 7];
		let active = 0;
		let peak = 0;

		await runQueued(
			items,
			async () => {
				active++;
				peak = Math.max(active, peak);
				await wait(5);
				active--;
			},
			{ limit: 3 },
		);

		expect(peak).toBe(3);
	});

	it("a freed slot is used right away", async () => {
		const items = [0, 1, 2];
		const gates = [createGate(), createGate(), createGate()];
		const started: number[] = [];

		const run = runQueued(
			items,
			async (item) => {
				started.push(item);
				await gates[item].promise;
			},
			{ limit: 2 },
		);

		await wait(0);
		expect(started).toEqual([0, 1]);

		gates[0].open();
		await wait(0);
		expect(started).toEqual([0, 1, 2]);

		gates[1].open();
		gates[2].open();
		await run;
	});

	it("does nothing for an empty list", async () => {
		const items: number[] = [];
		let calls = 0;

		await runQueued(
			items,
			async () => {
				calls++;
			},
			{ limit: 3 },
		);

		expect(calls).toBe(0);
	});

	it("a limit below 1 acts like 1", async () => {
		const items = [1, 2, 3, 4];
		let active = 0;
		let peak = 0;
		const seen: number[] = [];

		await runQueued(
			items,
			async (item) => {
				active++;
				peak = Math.max(active, peak);
				seen.push(item);
				await wait(5);
				active--;
			},
			{ limit: 0 },
		);

		expect(peak).toBe(1);
		expect(seen).toEqual([1, 2, 3, 4]);
	});
});

describe("runQueued start spacing", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("spaces starts by the interval", async () => {
		vi.useFakeTimers();
		const t0 = Date.now();
		const starts: number[] = [];

		const run = runQueued(
			[1, 2, 3],
			async () => {
				starts.push(Date.now() - t0);
			},
			{ limit: 3, startIntervalMs: 100 },
		);

		await vi.advanceTimersByTimeAsync(250);
		await run;

		expect(starts).toEqual([0, 100, 200]);
	});

	it("spaces starts even when only one runner is used", async () => {
		vi.useFakeTimers();
		const t0 = Date.now();
		const starts: number[] = [];

		const run = runQueued(
			[1, 2, 3],
			async () => {
				starts.push(Date.now() - t0);
			},
			{ limit: 1, startIntervalMs: 100 },
		);

		await vi.advanceTimersByTimeAsync(250);
		await run;

		expect(starts).toEqual([0, 100, 200]);
	});

	it("adds no extra delay when the worker is slower than the interval", async () => {
		vi.useFakeTimers();
		const t0 = Date.now();
		const starts: number[] = [];

		const run = runQueued(
			[1, 2],
			async () => {
				starts.push(Date.now() - t0);
				await wait(300);
			},
			{ limit: 1, startIntervalMs: 100 },
		);

		await vi.advanceTimersByTimeAsync(700);
		await run;

		expect(starts).toEqual([0, 300]);
	});

	it("never runs an item twice or skips one", async () => {
		vi.useFakeTimers();
		const items = [1, 2, 3, 4, 5, 6];
		const seen: number[] = [];

		const run = runQueued(
			items,
			async (item) => {
				seen.push(item);
			},
			{ limit: 3, startIntervalMs: 100 },
		);

		await vi.advanceTimersByTimeAsync(600);
		await run;

		expect(seen.sort((a, b) => a - b)).toEqual(items);
	});
});
