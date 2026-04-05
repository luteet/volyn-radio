import { styled } from "@mui/material";

export const Main = styled("input")`
	flex: 1 1 auto;
	min-width: 180px;

	padding: 10px 12px;

	border-radius: 10px;
	border: 1px solid var(--border);
	background: rgba(2, 6, 23, 0.35);
	
	font-size: 14px;
	color: var(--text);

	&:focus {
		outline: none;
	}

	&:focus-visible {
		border-color: rgba(45, 212, 191, 0.55);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.14);
	}
`;
