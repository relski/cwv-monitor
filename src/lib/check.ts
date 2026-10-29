import { db } from "../db";
import { checks } from "../db/schema";
import { fetchCrux } from "./crux";
import { fetchPsi } from "./psi";
import type { Strategy } from "./strategy";

export const performCheck = async (
	site: { id: number; url: string },
	strategy: Strategy,
) => {
	const [crux, psi] = await Promise.all([
		fetchCrux(site.url, strategy),
		fetchPsi(site.url, strategy),
	]);
	const [row] = await db
		.insert(checks)
		.values({
			siteId: site.id,
			strategy,
			fieldSource: crux?.source ?? null,
			fieldLcp: crux?.lcp ?? null,
			fieldInp: crux?.inp ?? null,
			fieldCls: crux?.cls ?? null,
			labLcp: psi.lcp,
			labCls: psi.cls,
			labTbt: psi.tbt,
			perfScore: psi.score,
		})
		.returning();
	return row;
};
