import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";
import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "#/db";
import { sessions, users } from "#/db/schema";
import {
	generateSessionToken,
	getSessionExpiry,
	hashSessionToken,
	SESSION_MAX_AGE_SECONDS,
} from "#/lib/session-token";

const SESSION_COOKIE_NAME = "session";

export async function createSession(userId: string): Promise<void> {
	await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
	const token = generateSessionToken();
	await db.insert(sessions).values({
		id: hashSessionToken(token),
		userId,
		expiresAt: getSessionExpiry(),
	});

	setCookie(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
}

export async function getSessionUser(): Promise<{
	id: string;
	email: string;
} | null> {
	const token = getCookie(SESSION_COOKIE_NAME);
	if (!token) return null;

	const [row] = await db
		.select({ id: users.id, email: users.email })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(
			and(
				eq(sessions.id, hashSessionToken(token)),
				gt(sessions.expiresAt, new Date()),
			),
		)
		.limit(1);

	return row ?? null;
}

export async function destroySession(): Promise<void> {
	const token = getCookie(SESSION_COOKIE_NAME);
	if (token)
		await db.delete(sessions).where(eq(sessions.id, hashSessionToken(token)));
	deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
}
