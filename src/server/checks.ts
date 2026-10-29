import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { strategySchema } from "#/lib/strategy";
import { db } from "../db";
import { sites } from "../db/schema";
import { performCheck } from "../lib/check";
import { requireUser } from "./auth";

export const runCheck = createServerFn({ method: "POST" })
	.validator(z.object({ siteId: z.number(), strategy: strategySchema }))
	.handler(async ({ data }) => {
		const user = await requireUser();
		const [site] = await db
			.select()
			.from(sites)
			.where(and(eq(sites.id, data.siteId), eq(sites.userId, user.id)))
			.limit(1);

		if (!site) throw new Error("Site not found");

		return performCheck(site, data.strategy);
	});
