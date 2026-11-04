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

		const worker = async (site: (typeof runSites)[number]) => {
			const key = runKey(site.id, runStrategy);

			try {
				try {
					await runCheck({ data: { siteId: site.id, strategy: runStrategy } });
				} catch (e) {
					const message = e instanceof Error ? e.message : "Check failed";

					setCheckErrors((previous) => ({
						...previous,
						[key]: message,
					}));

					return;
				}

				// The check succeeded, so remove any previous check error.
				setCheckErrors((previous) => {
					const next = { ...previous };
					delete next[key];
					return next;
				});

				try {
					await router.invalidate();
				} catch (e) {
					// Keep refresh failures distinct from check failures.
					const message =
						e instanceof Error
							? `Check succeeded, but refreshing results failed: ${e.message}`
							: "Check succeeded, but refreshing results failed";

					setCheckErrors((previous) => ({
						...previous,
						[key]: message,
					}));
				}
			} finally {
				setRunning((previous) => {
					const next = new Set(previous);
					next.delete(key);
					return next;
				});
			}
		};

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

	return { onCheckAll, checkingAll, running, checkErrors };
}
