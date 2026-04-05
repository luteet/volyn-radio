import { styled } from "@mui/material";

export const Main = styled("span")`
	--theme: 45, 212, 191;

	display: inline-block;

	flex: 0 0 14px;
	width: 14px; height: 14px;

	border-radius: 50%;
	border: 2px solid rgba(var(--theme), 0.25);
	border-top-color: rgba(var(--theme), 0.95);
	
	animation: loading 0.9s linear infinite;
`
