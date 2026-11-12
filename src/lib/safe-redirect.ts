export function safeRedirect(value: unknown): string {
	if (typeof value !== "string") return "/";
	if (!value.startsWith("/")) return "/";
	if (value.startsWith("//") || value.startsWith("/\\")) return "/";
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		// Refuse control characters (0-31), space (32 / 0x20), and DEL (127 / 0x7f)
		if (code <= 0x20 || code === 0x7f) {
			return "/";
		}
	}
	try {
		const parsed = new URL(value, "http://localhost");
		if (parsed.origin !== "http://localhost") return "/";
	} catch {
		return "/";
	}
	return value;
}
