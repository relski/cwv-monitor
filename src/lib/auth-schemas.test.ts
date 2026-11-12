import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth-schemas";

const validPassword = "correct horse";

// Which fields the parser complained about, for example ["email"]
function failedFields(result: {
	success: boolean;
	error?: { issues: { path: PropertyKey[] }[] };
}): PropertyKey[] {
	return result.error?.issues.map((issue) => issue.path[0] ?? "") ?? [];
}

describe("registerSchema", () => {
	describe("email", () => {
		it("trims spaces and makes the email lower-case", () => {
			const result = registerSchema.safeParse({
				email: "  Jo@X.com ",
				password: validPassword,
			});

			expect(result.success).toBe(true);
			expect(result.data?.email).toBe("jo@x.com");
		});

		it("treats different capital letters as the same email", () => {
			const first = registerSchema.parse({
				email: "JO@x.com",
				password: validPassword,
			});
			const second = registerSchema.parse({
				email: "jo@X.COM",
				password: validPassword,
			});

			expect(first.email).toBe(second.email);
		});

		it.each([
			["no @ sign", "abc"],
			["an empty string", ""],
			["only spaces", "   "],
			["nothing after the @", "a@"],
			["nothing before the @", "@x.com"],
			["no dot in the domain", "a@x"],
			["a space inside", "a b@x.com"],
			["two @ signs", "a@@x.com"],
			["longer than 254 characters", `${"a".repeat(249)}@x.com`],
		])("refuses %s", (_label, email) => {
			const result = registerSchema.safeParse({
				email,
				password: validPassword,
			});

			expect(result.success).toBe(false);
			expect(failedFields(result)).toContain("email");
		});

		it.each([
			["a number", 42],
			["null", null],
			["undefined", undefined],
		])("refuses %s as the email", (_label, email) => {
			const result = registerSchema.safeParse({
				email,
				password: validPassword,
			});

			expect(result.success).toBe(false);
			expect(failedFields(result)).toContain("email");
		});
	});

	describe("password", () => {
		it.each([
			["9 characters", "a".repeat(9), false],
			["10 characters", "a".repeat(10), true],
			["a normal password", validPassword, true],
			["128 characters", "a".repeat(128), true],
			["129 characters", "a".repeat(129), false],
			["an empty string", "", false],
		])("%s", (_label, password, ok) => {
			const result = registerSchema.safeParse({
				email: "jo@x.com",
				password,
			});

			expect(result.success).toBe(ok);
			if (!ok) expect(failedFields(result)).toContain("password");
		});

		it("does not trim the password", () => {
			const password = "  spaced pass  ";
			const result = registerSchema.safeParse({ email: "jo@x.com", password });

			expect(result.success).toBe(true);
			expect(result.data?.password).toBe(password);
		});

		it("does not change the capital letters of the password", () => {
			const password = "CaseMatters123";
			const result = registerSchema.safeParse({ email: "jo@x.com", password });

			expect(result.data?.password).toBe(password);
		});

		it.each([
			["a number", 1234567890],
			["null", null],
			["undefined", undefined],
		])("refuses %s as the password", (_label, password) => {
			const result = registerSchema.safeParse({
				email: "jo@x.com",
				password,
			});

			expect(result.success).toBe(false);
			expect(failedFields(result)).toContain("password");
		});
	});

	describe("the whole object", () => {
		it("refuses missing fields", () => {
			expect(registerSchema.safeParse({}).success).toBe(false);
			expect(registerSchema.safeParse({ email: "jo@x.com" }).success).toBe(
				false,
			);
			expect(
				registerSchema.safeParse({ password: validPassword }).success,
			).toBe(false);
		});

		it("drops fields it does not know about", () => {
			const result = registerSchema.safeParse({
				email: "jo@x.com",
				password: validPassword,
				isAdmin: true,
			});

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				email: "jo@x.com",
				password: validPassword,
			});
		});
	});
});

describe("loginSchema", () => {
	describe("email", () => {
		it("trims spaces and makes the email lower-case", () => {
			const result = loginSchema.safeParse({
				email: "  Jo@X.com ",
				password: validPassword,
			});

			expect(result.success).toBe(true);
			expect(result.data?.email).toBe("jo@x.com");
		});

		it("lets a malformed email through, so the login can give its one generic message", () => {
			const result = loginSchema.safeParse({
				email: "abc",
				password: validPassword,
			});

			expect(result.success).toBe(true);
			expect(result.data?.email).toBe("abc");
		});

		it("accepts 254 characters and refuses 255", () => {
			const at254 = loginSchema.safeParse({
				email: "a".repeat(254),
				password: validPassword,
			});
			const at255 = loginSchema.safeParse({
				email: "a".repeat(255),
				password: validPassword,
			});

			expect(at254.success).toBe(true);
			expect(at255.success).toBe(false);
			expect(failedFields(at255)).toContain("email");
		});

		it.each([
			["a number", 42],
			["null", null],
			["undefined", undefined],
		])("refuses %s as the email", (_label, email) => {
			const result = loginSchema.safeParse({
				email,
				password: validPassword,
			});

			expect(result.success).toBe(false);
			expect(failedFields(result)).toContain("email");
		});
	});

	describe("password", () => {
		it.each([
			["an empty string (the login check will say no)", "", true],
			["1 character", "a", true],
			["a short old password", "short", true],
			["128 characters", "a".repeat(128), true],
			["129 characters", "a".repeat(129), false],
		])("%s", (_label, password, ok) => {
			const result = loginSchema.safeParse({ email: "jo@x.com", password });

			expect(result.success).toBe(ok);
			if (!ok) expect(failedFields(result)).toContain("password");
		});

		it("does not trim the password", () => {
			const password = "  spaced pass  ";
			const result = loginSchema.safeParse({ email: "jo@x.com", password });

			expect(result.data?.password).toBe(password);
		});

		it.each([
			["a number", 1234567890],
			["null", null],
			["undefined", undefined],
		])("refuses %s as the password", (_label, password) => {
			const result = loginSchema.safeParse({ email: "jo@x.com", password });

			expect(result.success).toBe(false);
			expect(failedFields(result)).toContain("password");
		});
	});

	describe("the whole object", () => {
		it("refuses missing fields", () => {
			expect(loginSchema.safeParse({}).success).toBe(false);
			expect(loginSchema.safeParse({ email: "jo@x.com" }).success).toBe(false);
			expect(loginSchema.safeParse({ password: validPassword }).success).toBe(
				false,
			);
		});

		it("drops fields it does not know about", () => {
			const result = loginSchema.safeParse({
				email: "jo@x.com",
				password: validPassword,
				isAdmin: true,
			});

			expect(result.data).toEqual({
				email: "jo@x.com",
				password: validPassword,
			});
		});
	});
});
