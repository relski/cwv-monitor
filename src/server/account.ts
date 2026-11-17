import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "#/db";
import { sessions, users } from "#/db/schema";
import {
	changePasswordSchema,
	loginSchema,
	registerSchema,
} from "#/lib/auth-schemas";
import { hashPassword, verifyPassword } from "#/lib/password";
import { createRateLimiter } from "#/lib/rate-limit";
import { requireUser } from "./auth";
import { createSession, destroySession, getSessionUser } from "./session";

const INVALID_LOGIN_MESSAGE = "Invalid email or password";
const loginLimiter = createRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });
let dummyHash: Promise<string> | undefined;

function getDummyHash(): Promise<string> {
	if (dummyHash === undefined) {
		dummyHash = hashPassword("dummy-password");
	}

	return dummyHash;
}

function getClientIp(): string {
	return getRequestIP() ?? "unknown";
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<{ id: string; email: string } | null> => {
		const user = await getSessionUser();
		if (user) {
			return { id: user.id, email: user.email };
		} else {
			return null;
		}
	},
);

export const register = createServerFn({ method: "POST" })
	.validator(registerSchema)
	.handler(async ({ data }) => {
		const passwordHash = await hashPassword(data.password);
		const [user] = await db
			.insert(users)
			.values({ email: data.email, passwordHash })
			.onConflictDoNothing()
			.returning({ id: users.id });

		if (user === undefined) {
			return {
				ok: false as const,
				message: "That email is already registered",
			};
		}

		await createSession(user.id);

		return { ok: true as const };
	});

export const login = createServerFn({ method: "POST" })
	.validator(loginSchema)
	.handler(async ({ data }) => {
		const key = `${getClientIp()}|${data.email}`;
		const attempt = loginLimiter.hit(key);

		if (!attempt.allowed) {
			return {
				ok: false as const,
				message: `Too many attempts. Try again in ${Math.ceil(attempt.retryAfterMs / 60000)} minutes.`,
			};
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, data.email))
			.limit(1);

		const stored = user ? user.passwordHash : await getDummyHash();

		const valid = await verifyPassword(data.password, stored);

		if (!user || !valid) {
			return {
				ok: false as const,
				message: INVALID_LOGIN_MESSAGE,
			};
		}

		loginLimiter.reset(key);

		await destroySession();
		await createSession(user.id);

		return { ok: true as const };
	});

export const logout = createServerFn({ method: "POST" }).handler(async () => {
	await destroySession();
	return { ok: true as const };
});

export const changePassword = createServerFn({ method: "POST" })
	.validator(changePasswordSchema)
	.handler(async ({ data }) => {
		const user = await requireUser();
		const key = `change-password|${user.id}`;
		const attempt = loginLimiter.hit(key);

		if (!attempt.allowed)
			return {
				ok: false as const,
				message: `Too many attempts. Try again in ${Math.ceil(attempt.retryAfterMs / 60000)} minutes.`,
			};

		const [row] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id))
			.limit(1);
		if (!row) return { ok: false as const, message: "Account not found" };
		const valid = await verifyPassword(data.currentPassword, row.passwordHash);
		if (!valid)
			return { ok: false as const, message: "Current password is incorrect" };

		const newHash = await hashPassword(data.newPassword);
		await db
			.update(users)
			.set({ passwordHash: newHash })
			.where(eq(users.id, user.id));
		await db.delete(sessions).where(eq(sessions.userId, user.id));
		await createSession(user.id);
		loginLimiter.reset(key);
		return { ok: true as const };
	});
