function ThemeToggle() {
	return (
		<button
			type="button"
			onClick={() => {
				const html = document.documentElement;
				const nowDark = html.classList.toggle("dark");
				try {
					localStorage.setItem("theme", nowDark ? "dark" : "light");
				} catch {
					("storage unavailable, ignore");
				}
			}}
			className="rounded-md border border-border bg-background p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
			aria-label="Toggle theme"
			title="Toggle theme"
		>
			<svg
				aria-hidden="true"
				className="h-5 w-5 hidden dark:block"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.344l-.707.707M1.5 12a10.5 10.5 0 1121 0 10.5 10.5 0 01-21 0z"
				/>
			</svg>
			<svg
				aria-hidden="true"
				className="h-5 w-5 block dark:hidden"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
		</button>
	);
}

export { ThemeToggle };
