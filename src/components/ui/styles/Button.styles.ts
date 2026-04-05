import { styled } from "@mui/material";

export const Main = styled("button")`
	padding: 10px 12px;

	border-radius: 10px;
	border: 1px solid var(--border);
	background: var(--accent);

	color: #062a27;
	font-weight: 600;
	
	transition: filter 160ms ease, border-color 160ms ease, background-color 160ms ease;

	cursor: pointer;

	&:hover:not(:disabled) {
		filter: brightness(1.05);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;
