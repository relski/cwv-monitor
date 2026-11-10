import { createServerFn } from "@tanstack/react-start";
import { requireUser } from "./auth";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async (): Promise<{ id: string } | null> => {
		const user = await requireUser();
		return { id: user.id };
	},
);
