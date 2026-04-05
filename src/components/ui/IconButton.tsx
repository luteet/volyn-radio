import type { PropsWithChildren, ReactNode } from "react";
import { Main, MainSmall } from "./styles/IconButton.styles";

type Variant = "default" | "secondary" | "danger";
type Size = "default" | "small";

export function IconButton({
	variant = "default",
	size = "default",
	className,
	title,
	"aria-label": ariaLabel,
	disabled,
	onClick,
	children,
}: PropsWithChildren<{
	variant?: Variant;
	size?: Size;
	className?: string;
	title?: string;
	"aria-label"?: string;
	disabled?: boolean;
	onClick?: () => void;
	children: ReactNode;
}>) {
	const classes = [
		variant === "secondary" ? "secondary" : "",
		variant === "danger" ? "danger" : "",
		className || "",
	]
		.filter(Boolean)
		.join(" ");

	const Button = size === "small" ? MainSmall : Main;

	return (
		<Button
			className={classes}
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			aria-label={ariaLabel}
		>
			<span>
				{children}
			</span>
		</Button>
	);
}

