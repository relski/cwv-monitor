import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldGroup } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { addSite } from "#/server/sites";

function AddSiteForm() {
	const router = useRouter();
	const [error, setError] = useState("");
	const form = useForm({
		defaultValues: {
			url: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			setError("");
			try {
				await addSite({ data: { url: value.url, name: value.name } });
				form.reset();
				router.invalidate();
			} catch {
				setError("Enter a valid URL, including https://");
			}
		},
	});

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="my-5"
			>
				<FieldGroup>
					<div className="flex flex-wrap items-start gap-2">
						<form.Field
							name="url"
							validators={{
								onChange: ({ value }) =>
									value && !/^https?:\/\/.+/.test(value)
										? "Enter a valid URL"
										: undefined,
							}}
						>
							{(field) => (
								<Field className="flex-1 min-w-48">
									<Input
										id={field.name}
										name={field.name}
										type="url"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="https://example.com"
									/>

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
						<form.Field name="name">
							{(field) => (
								<Field className="flex-1 min-w-48">
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Name (optional)"
										maxLength={60}
									/>
								</Field>
							)}
						</form.Field>
						<Button type="submit">Add</Button>
					</div>
				</FieldGroup>
			</form>
			{error && <p className="text-destructive">{error}</p>}
		</>
	);
}

export { AddSiteForm };
