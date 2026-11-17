import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().max(254);

export const registerSchema = z.object({
	email: emailSchema.pipe(z.email()),
	password: z.string().min(10).max(128),
});

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().max(128),
});

export const changePasswordSchema = z.object({
	currentPassword: z.string().max(128),
	newPassword: z.string().min(10).max(128),
});
