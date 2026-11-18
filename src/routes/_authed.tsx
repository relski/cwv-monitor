import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useSearch,
} from "@tanstack/react-router";
import {
	Binoculars,
	FlaskConical,
	Globe,
	LayoutDashboard,
	User,
} from "lucide-react";
import { SignOutButton } from "#/components/sign-out-button";
import { ThemeToggle } from "#/components/theme-toggle";
import { Button } from "#/components/ui/button";
import { getCurrentUser } from "#/server/account";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async () => {
		const user = await getCurrentUser();
		if (!user) throw redirect({ to: "/login" });
		return { user };
	},
	component: AuthedLayout,
});

function AuthedLayout() {
	const { user } = Route.useRouteContext();
	const { strategy } = useSearch({ strict: false });

	return (
		<div className="min-h-screen md:flex">
			<aside className="hidden md:flex md:sticky md:top-0 md:h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
				<Link to="/" className="p-4 text-lg font-semibold">
					CWV Monitor
				</Link>
				<nav aria-label="Main" className="px-2">
					<ul>
						<li>
							<Link
								to="/"
								className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
							>
								Overview
							</Link>
						</li>
						<li>
							<Link
								to="/field"
								className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
								search={{ strategy }}
								activeOptions={{ includeSearch: false }}
							>
								<Binoculars className="size-4" />
								Field data
							</Link>
						</li>
						<li>
							<Link
								to="/lab"
								className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
								search={{ strategy }}
								activeOptions={{ includeSearch: false }}
							>
								<FlaskConical className="size-4" />
								Lab data
							</Link>
						</li>
						<li>
							<Link
								to="/sites"
								className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
							>
								Sites
							</Link>
						</li>
					</ul>
				</nav>
				<div className="mt-auto flex flex-col gap-2 px-2 py-4">
					<Link
						to="/settings"
						title={user.email}
						className="block truncate rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						activeProps={{
							className: "bg-sidebar-accent text-sidebar-accent-foreground",
							"aria-current": "page",
						}}
					>
						{user.email}
					</Link>
					<div className="flex items-center justify-between">
						<SignOutButton />
						<ThemeToggle />
					</div>
				</div>
			</aside>
			<div className="flex-1 min-w-0">
				<header className="md:hidden flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3">
					<Link to="/" className="text-lg font-semibold">
						CWV Monitor
					</Link>
					<div className="flex items-center gap-2">
						<Button asChild variant="ghost" size="icon-sm">
							<Link to="/settings" aria-label="Account settings">
								<User />
							</Link>
						</Button>
						<SignOutButton />
						<ThemeToggle />
					</div>
				</header>
				<main className="max-w-300 mx-auto p-4 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-4">
					<Outlet />
				</main>
				<nav
					aria-label="Main"
					className="fixed inset-x-0 bottom-0 md:hidden bg-sidebar border-t border-sidebar-border z-30 pb-[env(safe-area-inset-bottom)]"
				>
					<ul className="grid grid-cols-4">
						<li>
							<Link
								to="/"
								aria-label="Overview"
								className="flex flex-col items-center gap-1 py-2 text-xs font-medium"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
							>
								<LayoutDashboard className="size-5" />
							</Link>
						</li>
						<li>
							<Link
								to="/field"
								aria-label="Field"
								className="flex flex-col items-center gap-1 py-2 text-xs font-medium"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
								search={{ strategy }}
								activeOptions={{ includeSearch: false }}
							>
								<Binoculars className="size-5" />
							</Link>
						</li>
						<li>
							<Link
								to="/lab"
								aria-label="Lab"
								className="flex flex-col items-center gap-1 py-2 text-xs font-medium"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
								search={{ strategy }}
								activeOptions={{ includeSearch: false }}
							>
								<FlaskConical className="size-5" />
							</Link>
						</li>
						<li>
							<Link
								to="/sites"
								aria-label="Sites"
								className="flex flex-col items-center gap-1 py-2 text-xs font-medium"
								activeProps={{
									className: "bg-sidebar-accent text-sidebar-accent-foreground",
									"aria-current": "page",
								}}
							>
								<Globe className="size-5" />
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}
