import { styled } from "@mui/material";

export const Main = styled("button")`
	width: 46px; height: 46px;
	
	padding: 0;
	
	border-radius: 10px;
	border: 1px solid var(--border);
	background: rgba(20, 184, 166, 0.15);
	
	color: var(--accent-2);
	font-weight: 700;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	
	transition:
		border-color 160ms ease,
		background-color 160ms ease,
		color 160ms ease;

	&:disabled {
		opacity: 0.5;

		cursor: not-allowed;
	}

	&:not(:disabled, .active):hover {
		border-color: rgba(45, 212, 191, 0.45);
	}

	&.small {
		width: 32px; height: 32px;

		border-radius: 8px;
	}

	&.secondary {
		background: rgba(148, 163, 184, 0.08);
		color: var(--text);

		&:hover:not(:disabled) {
			border-color: rgba(148, 163, 184, 0.45);
		}
	}

	&.danger {
		background: rgba(248, 113, 113, 0.12);
		color: #fecaca;

		&:hover:not(:disabled) {
			border-color: rgba(248, 113, 113, 0.45);
		}
	}

	span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
`;

export const MainSmall = styled(Main)`
	width: 32px; height: 32px;

	border-radius: 8px;
`;
