import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { checks, sites } from "#/db/schema";
import { requireUser } from "./auth";

export const listSites = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireUser();

	// List the user's sites
	const rows = await db
		.select()
		.from(sites)
		.where(eq(sites.userId, user.id))
		.orderBy(desc(sites.createdAt));

	// Keep sites query, and bail out early if it’s empty
	if (rows.length === 0) return [];

	// CWV data for sites, newest first
	const allChecks = await db
		.select()
		.from(checks)
		.where(
			inArray(
				checks.siteId,
				rows.map((r) => r.id),
			),
		)
		.orderBy(desc(checks.createdAt));

	// Keep only the first (newest) check we see for each site
	const latestBySite = new Map<number, (typeof allChecks)[number]>();
	for (const c of allChecks) {
		if (!latestBySite.has(c.siteId)) latestBySite.set(c.siteId, c);
	}

	// Sites with their latest check attached (null if never checked)
	return rows.map((r) => ({ ...r, latest: latestBySite.get(r.id) ?? null }));
});

export const addSite = createServerFn({ method: "POST" })
	.validator(z.object({ url: z.string().url() }))
	.handler(async ({ data }) => {
		const user = await requireUser();
		const url = new URL(data.url).toString();
		await db
			.insert(sites)
			.values({ userId: user.id, url })
			.onConflictDoNothing();
		return { ok: true };
	});

export const getSiteHistory = createServerFn({ method: "GET" })
	.validator(z.object({ siteId: z.number() }))
	.handler(async ({ data }) => {
		const user = await requireUser();
		const [site] = await db
			.select()
			.from(sites)
			.where(and(eq(sites.id, data.siteId), eq(sites.userId, user.id)))
			.limit(1);

		if (!site) throw new Error("Site not found");

		const history = await db
			.select()
			.from(checks)
			.where(eq(checks.siteId, site.id))
			.orderBy(desc(checks.createdAt))
			.limit(50);

		return { site, history };
	});
