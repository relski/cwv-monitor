import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { RegisterForm } from "#/components/register-form";
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

export const Route = createFileRoute("/register")({
	beforeLoad: async () => {
		const user = await getCurrentUser();
		if (user) throw redirect({ to: "/" });
	},
	component: RegisterPage,
});

function RegisterPage() {
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Track your sites’ Core Web Vitals</CardDescription>
				</CardHeader>
				<CardContent>
					<RegisterForm />
				</CardContent>
				<CardFooter className="justify-center">
					<Button asChild variant="link">
						<Link to="/login">Already have an account? Sign in</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
