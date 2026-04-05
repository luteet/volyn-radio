import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Main } from "./styles/Button.styles";

export function Button({
	children,
	...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
	return (
		<Main {...props}>
			{children}
		</Main>
	);
}

