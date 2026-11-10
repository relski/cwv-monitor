import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return <h1 className="text-2xl my-5">Sign in</h1>;
}
