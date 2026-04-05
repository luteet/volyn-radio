import type { SyntheticEvent } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import * as S from "./styles/Enqueue.styles";

export function EnqueueForm({
	value,
	isSubmitting,
	onChange,
	onSubmit,
}: {
	value: string;
	isSubmitting: boolean;
	onChange: (v: string) => void;
	onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
}) {
	return (
		<S.Form onSubmit={onSubmit}>
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="https://www.youtube.com/watch?v=..."
				inputMode="url"
				autoComplete="off"
				spellCheck={false}
			/>
			<Button type="submit" disabled={isSubmitting || !value.trim()}>
				{isSubmitting ? "Adding..." : "Add"}
			</Button>
		</S.Form>
	);
}

