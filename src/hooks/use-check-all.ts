import { useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { runQueued } from "#/lib/concurrency";
import type { Strategy } from "#/lib/strategy";
import { runCheck } from "#/server/checks";

const MAX_IN_FLIGHT = 3;
const START_SPACING_MS = 100;

export function runKey(siteId: number, strategy: Strategy): string {
	return `${siteId}:${strategy}`;
}

export function useCheckAll(sites: { id: number }[], strategy: Strategy) {
	const router = useRouter();
	const [running, setRunning] = useState<Set<string>>(() => new Set());
	const [checkingAll, setCheckingAll] = useState(false);
	const [checkErrors, setCheckErrors] = useState<Record<string, string>>({});
	const ref = useRef(false);

	// Runs one check, then refreshes the list.
	// The caller adds the key to `running` and clears the old error first;
	// this function removes the key from `running` when it is done, whatever happens.
	async function checkSite(siteId: number, runStrategy: Strategy) {
		const key = runKey(siteId, runStrategy);
		// tells the catch block which step failed
		let refreshing = false;

		try {
			await runCheck({ data: { siteId, strategy: runStrategy } });
			refreshing = true;
			await router.invalidate();
		} catch (e) {
			let message: string;

			if (refreshing) {
				// Keep refresh failures distinct from check failures.
				message =
					e instanceof Error
						? `Check succeeded, but refreshing results failed: ${e.message}`
						: "Check succeeded, but refreshing results failed";
			} else {
				message = e instanceof Error ? e.message : "Check failed";
			}

			setCheckErrors((previous) => ({
				...previous,
				[key]: message,
			}));
		} finally {
			setRunning((previous) => {
				const next = new Set(previous);
				next.delete(key);
				return next;
			});
		}
	}

	async function onCheckAll() {
		if (sites.length === 0 || ref.current) return;
		ref.current = true;
		setCheckingAll(true);

		const runStrategy = strategy;
		const runSites = sites;

		setRunning((previous) => {
			const next = new Set(previous);
			for (const site of runSites) {
				next.add(runKey(site.id, runStrategy));
			}
			return next;
		});

		setCheckErrors((previous) => {
			const next = { ...previous };

			for (const site of runSites) {
				delete next[runKey(site.id, runStrategy)];
			}

			return next;
		});

		const worker = (site: (typeof runSites)[number]) =>
			checkSite(site.id, runStrategy);

		try {
			await runQueued(runSites, worker, {
				limit: MAX_IN_FLIGHT,
				startIntervalMs: START_SPACING_MS,
			});
		} finally {
			ref.current = false;
			setCheckingAll(false);
		}
	}

	async function onCheckSite(siteId: number) {
		const key = runKey(siteId, strategy);
		// a check for this site is already running
		if (running.has(key)) return;

		setRunning((previous) => new Set(previous).add(key));
		setCheckErrors((previous) => {
			const next = { ...previous };
			delete next[key];
			return next;
		});

		await checkSite(siteId, strategy);
	}

	return { onCheckAll, onCheckSite, checkingAll, running, checkErrors };
}
