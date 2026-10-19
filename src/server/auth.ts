// Stub: swap for real session lookup when auth is added
export async function requireUser() {
	return { id: "local-user" };
}
