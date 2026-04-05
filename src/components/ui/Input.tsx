import type { InputHTMLAttributes } from "react";
import { Main } from "./styles/Input.styles";

export function Input({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
	return <Main {...props} />;
}
