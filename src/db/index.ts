import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireEnv } from "#/lib/env";
import * as schema from "./schema";

export const db = drizzle(postgres(requireEnv("DATABASE_URL")), { schema });
