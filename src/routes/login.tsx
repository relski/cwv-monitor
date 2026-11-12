import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "#/components/login-form";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { getCurrentUser } from "#/server/account";

export const Route = createFileRoute("/login")({
	validateSearch: z.object({ redirect: z.string().optional() }),
	beforeLoad: async () => {
		const user = await getCurrentUser();
		if (user) throw redirect({ to: "/" });
	},
	component: LoginPage,
});

function LoginPage() {
	const { redirect } = Route.useSearch();

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Log in</CardTitle>
					<CardDescription>Sign in to see your sites</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm redirectTo={redirect} />
				</CardContent>
				<CardFooter className="justify-center">
					<Button asChild variant="link">
						<Link to="/register">Create an account</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
