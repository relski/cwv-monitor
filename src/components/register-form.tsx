import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
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
import { register } from "#/server/account";

function RegisterForm() {
	const router = useRouter();
	const [error, setError] = useState("");
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			setError("");
			try {
				const result = await register({ data: value });
				if (!result.ok) {
					setError(result.message);
					return;
				}
			} catch {
				setError(
					"Could not create your account. Check your details and try again.",
				);
				return;
			}
			await router.invalidate();
			router.history.push("/");
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
				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Email</FieldLabel>
							<Input
								id={field.name}
								type="email"
								autoComplete="username"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</Field>
					)}
				</form.Field>

				<form.Field
					name="password"
					validators={{
						onBlur: ({ value }) =>
							value && value.length < 10
								? "Use at least 10 characters"
								: undefined,
					}}
				>
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Password</FieldLabel>
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

			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creating account..." : "Create account"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}

export { RegisterForm };
