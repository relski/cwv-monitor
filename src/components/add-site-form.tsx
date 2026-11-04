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
		},
		onSubmit: async ({ value }) => {
			setError("");
			try {
				await addSite({ data: { url: value.url } });
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
							<Field orientation="horizontal" className="flex flex-wrap">
								<Input
									id={field.name}
									name={field.name}
									type="url"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="https://example.com"
									className="flex-1"
								/>
								<Button type="submit">Add</Button>
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
			</form>
			{error && <p className="text-destructive">{error}</p>}
		</>
	);
}

export { AddSiteForm };
