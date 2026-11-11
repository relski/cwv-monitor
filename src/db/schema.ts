import {
	index,
	integer,
	pgTable,
	real,
	serial,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import type { Strategy } from "#/lib/strategy";

export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [index("sessions_user_id_idx").on(t.userId)],
);

export const sites = pgTable(
	"sites",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull(),
		url: text("url").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [unique().on(t.userId, t.url)],
);

export const checks = pgTable(
	"checks",
	{
		id: serial("id").primaryKey(),
		siteId: integer("site_id")
			.notNull()
			.references(() => sites.id, { onDelete: "cascade" }),
		strategy: text("strategy").$type<Strategy>().notNull(),

		// Field data: real users, from CrUX (p75). Null when there isn't enough traffic.
		fieldSource: text("field_source"), // 'url' | 'origin' | null
		fieldLcp: real("field_lcp"), // milliseconds
		fieldInp: real("field_inp"), // milliseconds
		fieldCls: real("field_cls"), // unitless score
		fieldFcp: real("field_fcp"), // milliseconds
		fieldTtfb: real("field_ttfb"), // milliseconds

		// Lab data: a test run now, from PageSpeed Insights
		labLcp: real("lab_lcp"),
		labCls: real("lab_cls"),
		labTbt: real("lab_tbt"), // stand-in for INP, which can't be measured in a lab
		labFcp: real("lab_fcp"),
		labSpeedIndex: real("lab_speed_index"),
		perfScore: integer("perf_score"), // 0-100

		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [
		index("checks_site_strategy_created_idx").on(
			t.siteId,
			t.strategy,
			t.createdAt,
		),
	],
);

export type Check = typeof checks.$inferSelect;
export type User = typeof users.$inferSelect;
