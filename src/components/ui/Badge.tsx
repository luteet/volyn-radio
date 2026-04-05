import type { PropsWithChildren } from "react";
import { Item, SmallItem } from "./styles/Badge.styles";

export function Badge({
	size = "default",
	className,
	children,
}: PropsWithChildren<{ size?: "default" | "small"; className?: string }>) {

	return size === "default" ? (
		<Item className={className}>
			{children}
		</Item>
	) : (
		<SmallItem className={className}>
			{children}
		</SmallItem>
	);

}
