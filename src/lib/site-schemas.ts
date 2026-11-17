import { z } from "zod";

export const siteNameSchema = z
	.string()
	.trim()
	.max(60)
	.transform((name) => name || null);
