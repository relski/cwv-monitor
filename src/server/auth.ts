import { getSessionUser } from "./session";

export async function requireUser() {
	const user = await getSessionUser();

	if (!user) {
		throw new Error("Not signed in");
	}

	return { id: user.id };
}
