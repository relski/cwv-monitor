import { createHash, randomBytes } from "node:crypto";

// 60 seconds × 60 minutes × 24 hours × 30 days,
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function generateSessionToken(): string {
	return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiry(now: number = Date.now()): Date {
	return new Date(now + SESSION_MAX_AGE_SECONDS * 1000);
}
