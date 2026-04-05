import { styled } from "@mui/material";

export const Main = styled("aside") <{ isPlacing: boolean }>`

	position: fixed;
	top: var(--aside-inset);
	right: var(--aside-inset);
	bottom: var(--aside-inset);

	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 12px;

	width: var(--aside-width);

	padding-top: 12px;
	
	background-color: transparent;

	z-index: 6;

	${({ isPlacing }) => (isPlacing ? `
		pointer-events: none;
  		opacity: 0.65;
	` : null)};
`;

export const Inner = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;

export const ButtonWrapper = styled("div")`
	position: relative;

	display: inline-flex;
	align-items: center;
	justify-content: center;
`;

export const Button = styled("button")`
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: 46px; height: 46px;

	border-radius: 12px;
	border: 1px solid var(--border);
	background-color: rgba(148, 163, 184, 0.08);

	color: var(--text);
	font-weight: 700;
	font-size: 12px;
	
	transition:
		border-color 160ms ease,
		background-color 160ms ease,
		color 160ms ease;
	
	cursor: pointer;

	&.active {
		border-color: rgba(45, 212, 191, 0.65);
		background: rgba(45, 212, 191, 0.14);
		color: var(--accent-2);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
		animation: playerDockPulse 1.8s ease-in-out infinite;
	}

	&:hover:not(:disabled, .active) {
		border-color: rgba(45, 212, 191, 0.45);
		color: var(--accent-2);
	}

	&:hover:not(:disabled) + [role="tooltip"] {
		opacity: 1;
		transform: translateY(-50%) translateX(0);
	}

	&:focus-visible {
		outline: none;
		border-color: rgba(45, 212, 191, 0.55);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.14);
	}

`;

export const ButtonTooltip = styled("div")`
	position: absolute;
	top: 50%; right: calc(100% + 14px);
	transform: translateY(-50%) translateX(6px);

	max-width: 240px;

	padding: 10px 12px;

	border-radius: 12px;
	border: 1px solid var(--border);
	background: var(--card);

	color: var(--text);
	font-size: 12px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	opacity: 0;
	pointer-events: none;

	transition:
		opacity 120ms ease,
		transform 120ms ease;
		
	z-index: 10;

	&::after {
		content: "";
		position: absolute;
		top: 50%;
		right: -6px;
		width: 10px;
		height: 10px;
		transform: translateY(-50%) rotate(45deg);
		border-right: 1px solid var(--border);
		border-top: 1px solid var(--border);
		background: var(--card);
	}
`;
