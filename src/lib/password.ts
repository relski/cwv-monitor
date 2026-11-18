import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
	password: string,
	salt: Buffer,
	keylen: number,
) => Promise<Buffer>;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_LENGTH);
	const hash = await scryptAsync(password, salt, KEY_LENGTH);
	return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const parts = stored.split(":");
	if (parts.length !== 2) return false;
	const [saltHex, hashHex] = parts;
	const salt = Buffer.from(saltHex, "hex");
	const expected = Buffer.from(hashHex, "hex");
	if (salt.length === 0 || expected.length !== KEY_LENGTH) return false;
	const actual = await scryptAsync(password, salt, KEY_LENGTH);
	return timingSafeEqual(actual, expected);
}

export { hashPassword, verifyPassword };
