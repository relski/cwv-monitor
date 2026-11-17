import { z } from "zod";

export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

// Anything unknown or missing means "system", the default.
export const themeSchema = z.enum(THEMES).catch("system");

export function parseTheme(value: unknown): Theme {
	return themeSchema.parse(value);
}

// The functions below use `window`, `document` and `localStorage`. They are
// browser only: call them from event handlers and effects, never when the
// module loads, because this file is also imported while the page is built
// on the server.

export function getStoredTheme(): Theme {
	try {
		return parseTheme(localStorage.getItem("theme"));
	} catch {
		return "system";
	}
}

export function applyTheme(theme: Theme): void {
	let dark: boolean;

	if (theme === "system") {
		try {
			localStorage.removeItem("theme");
		} catch {
			// Ignore storage access errors.
		}
		dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	} else {
		try {
			localStorage.setItem("theme", theme);
		} catch {
			// Ignore storage access errors.
		}
		dark = theme === "dark";
	}

	// The script in __root.tsx only adds the class, so remove it here too.
	document.documentElement.classList.toggle("dark", dark);
	window.dispatchEvent(new Event("themechange"));
}

export function subscribeToTheme(callback: () => void): () => void {
	window.addEventListener("themechange", callback);
	window.addEventListener("storage", callback);

	return () => {
		window.removeEventListener("themechange", callback);
		window.removeEventListener("storage", callback);
	};
}
