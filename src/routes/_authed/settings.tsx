import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordForm } from "#/components/change-password-form";
import { ThemePicker } from "#/components/theme-picker";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";

export const Route = createFileRoute("/_authed/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const { user } = Route.useRouteContext();

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl">Settings</h1>
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Account</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Email</p>
					<p className="break-all">{user.email}</p>
				</CardContent>
			</Card>
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Change password</CardTitle>
					<CardDescription>Other devices will be signed out.</CardDescription>
				</CardHeader>
				<CardContent>
					<ChangePasswordForm />
				</CardContent>
			</Card>
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
					<CardDescription>System follows your device.</CardDescription>
				</CardHeader>
				<CardContent>
					<ThemePicker />
				</CardContent>
			</Card>
		</div>
	);
}
