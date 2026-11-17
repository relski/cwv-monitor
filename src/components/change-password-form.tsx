import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { changePassword } from "#/server/account";

function ChangePasswordForm() {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
		onSubmit: async ({ value }) => {
			setError("");
			setSuccess("");
			try {
				const result = await changePassword({ data: value });
				if (!result.ok) {
					setError(result.message);
					return;
				}
			} catch {
				setError(
					"Could not change the password. Check your details and try again.",
				);
				return;
			}
			form.reset();
			setSuccess("Password changed. Other devices have been signed out.");
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
			className="flex flex-col gap-6"
		>
			<FieldGroup className="gap-4">
				<form.Field name="currentPassword">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Current password</FieldLabel>
							<Input
								id={field.name}
								type="password"
								autoComplete="current-password"
								maxLength={128}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</Field>
					)}
				</form.Field>

				<form.Field
					name="newPassword"
					validators={{
						onBlur: ({ value }) =>
							value && value.length < 10
								? "Use at least 10 characters"
								: undefined,
					}}
				>
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>New password</FieldLabel>
							<Input
								id={field.name}
								type="password"
								autoComplete="new-password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								maxLength={128}
							/>
							<FieldDescription>At least 10 characters</FieldDescription>
							{field.state.meta.errors.length > 0 && (
								<FieldError
									errors={field.state.meta.errors.map((err) => ({
										message: String(err),
									}))}
								/>
							)}
						</Field>
					)}
				</form.Field>
			</FieldGroup>

			{error && <FieldError>{error}</FieldError>}
			{success && (
				<output className="text-sm text-muted-foreground">{success}</output>
			)}

			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Change password"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}

export { ChangePasswordForm };
