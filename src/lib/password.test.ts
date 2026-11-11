import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
	it("returns one salt and one hash joined by a single colon", async () => {
		const stored = await hashPassword("correct horse battery");
		const parts = stored.split(":");

		expect(parts).toHaveLength(2);
		// 16 salt bytes and 64 hash bytes, written as hex (2 characters per byte)
		expect(parts[0]).toMatch(/^[0-9a-f]{32}$/);
		expect(parts[1]).toMatch(/^[0-9a-f]{128}$/);
	});

	it("gives a different result each time for the same password (random salt)", async () => {
		const first = await hashPassword("same password");
		const second = await hashPassword("same password");

		expect(first).not.toBe(second);
	});

	it("does not contain the password itself", async () => {
		const stored = await hashPassword("hunter2hunter2");

		expect(stored).not.toContain("hunter2hunter2");
	});
});

describe("verifyPassword", () => {
	it("accepts the right password", async () => {
		const stored = await hashPassword("correct horse battery");

		expect(await verifyPassword("correct horse battery", stored)).toBe(true);
	});

	it("rejects a wrong password", async () => {
		const stored = await hashPassword("correct horse battery");

		expect(await verifyPassword("wrong horse battery", stored)).toBe(false);
	});

	it("is case sensitive", async () => {
		const stored = await hashPassword("Correct Horse");

		expect(await verifyPassword("correct horse", stored)).toBe(false);
	});

	it("accepts the right password for two different hashes of it", async () => {
		const first = await hashPassword("same password");
		const second = await hashPassword("same password");

		expect(await verifyPassword("same password", first)).toBe(true);
		expect(await verifyPassword("same password", second)).toBe(true);
	});

	it("works with spaces, emoji and non-English letters", async () => {
		const password = "  pässwörd 🔐 ключ  ";
		const stored = await hashPassword(password);

		expect(await verifyPassword(password, stored)).toBe(true);
		expect(await verifyPassword(password.trim(), stored)).toBe(false);
	});

	it("works with the longest password the form will allow (128 characters)", async () => {
		const password = "a".repeat(128);
		const stored = await hashPassword(password);

		expect(await verifyPassword(password, stored)).toBe(true);
		expect(await verifyPassword("a".repeat(127), stored)).toBe(false);
	});

	it("hashes and checks an empty password without throwing", async () => {
		const stored = await hashPassword("");

		expect(await verifyPassword("", stored)).toBe(true);
		expect(await verifyPassword("x", stored)).toBe(false);
	});

	// A broken value in the database must give "wrong password", not a crash.
	const brokenValues: [string, string][] = [
		["an empty string", ""],
		["no colon", "nocolon"],
		["too many colons", "aa:bb:cc"],
		["too short to be a real hash", "abc:def"],
		["not hex text", "zz:zz"],
		["an empty salt", `:${"ab".repeat(64)}`],
		["an empty hash", `${"ab".repeat(16)}:`],
		[
			"a hash that is one byte too short",
			`${"ab".repeat(16)}:${"ab".repeat(63)}`,
		],
		[
			"a hash that is one byte too long",
			`${"ab".repeat(16)}:${"ab".repeat(65)}`,
		],
	];

	it.each(
		brokenValues,
	)("returns false for a stored value with %s", async (_label, stored) => {
		expect(await verifyPassword("anything", stored)).toBe(false);
	});
});
