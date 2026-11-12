import { useState } from "react";
import { logout } from "#/server/account";
import { Button } from "./ui/button";

function SignOutButton() {
	const [signingOut, setSigningOut] = useState<boolean>(false);

	async function handleSignOut() {
		if (signingOut) return;

		setSigningOut(true);

		try {
			await logout();
			window.location.assign("/login");
		} catch {
			setSigningOut(false);
		}
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			disabled={signingOut}
			onClick={handleSignOut}
		>
			{signingOut ? "Signing out..." : "Sign out"}
		</Button>
	);
}

export { SignOutButton };
