import { styled } from "@mui/material";

export const Main = styled("div")`
	display: flex;
	align-items: center;
	gap: 10px;

	flex: 0 0 auto;
`;

export const Button = styled("button")`
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: 46px; height: 46px;

	padding: 0;

	border: 1px solid var(--border);
	background-color: rgba(148, 163, 184, 0.06);
	border-radius: 10px;

	color: var(--muted);
	
	transition:
		border-color 160ms ease,
		background-color 160ms ease,
		color 160ms ease;

	cursor: pointer;

	&:hover:not(:disabled) {
		border-color: rgba(45, 212, 191, 0.35);
		color: var(--accent-2);
	}

	&:focus-visible {
		outline: none;
		border-color: rgba(45, 212, 191, 0.55);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.14);
	}
`;

export const Slider = styled("input")`
	flex: 0 0 auto;
	width: 112px; height: 16px;

	appearance: none;
	-webkit-appearance: none;

	background-color: transparent;
	
	cursor: pointer;

	@media (max-width: 520px) {
		display: none;
	}

	&:focus {
		outline: none;
	}

	&::-webkit-slider-runnable-track {
		height: 6px;

		background-image: linear-gradient(to right, var(--accent-2) var(--value), rgba(148, 163, 184, 0.22) var(--value));
		border-radius: 16px;
	}

	&::-webkit-slider-thumb {
		width: 14px; height: 14px;
		
		margin-top: -5px;

		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.18);
		border: 1px solid rgba(45, 212, 191, 0.6);
		background: var(--accent-2);
		border-radius: 16px;

		-webkit-appearance: none;
		appearance: none;
	}

	&::-moz-range-track {
		height: 6px;
		
		background: rgba(148, 163, 184, 0.22);
		border-radius: 16px;
	}

	&::-moz-range-thumb {
		width: 14px; height: 14px;
		
		border-radius: 16px;
		background: var(--accent-2);
		border: 1px solid rgba(45, 212, 191, 0.6);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.18);
	}
`;
