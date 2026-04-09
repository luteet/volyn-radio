import { styled } from "@mui/material";

export const Main = styled("div") <{ isOpen: boolean }>`

	position: fixed;
	top: var(--aside-inset);
	bottom: var(--aside-inset);
	right: var(--aside-popup-gap);

	width: var(--aside-popup-width);
	max-width: calc(100vw - var(--aside-inset) * 2 - var(--aside-popup-width) - var(--aside-popup-gap));

	z-index: 5;
	pointer-events: none;

	background: var(--bg);
	border: 1px solid var(--border);
	border-radius: 14px;

	transform: translateX(100%);
	opacity: 0;

	transition:
		transform 200ms ease,
		opacity 200ms ease;

	overflow: clip;

	${({ isOpen }) => (isOpen ? `
		transform: translateX(0);
		opacity: 1;
		pointer-events: auto;
	` : null)};

`;

export const Inner = styled("div")`
	height: 100%;

	padding: 14px;

	overflow-y: auto;
`;

export const Header = styled("div")`
	flex: 0 0 auto;

	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 10px 2px 14px;
	margin-bottom: 14px;

	border-bottom: 1px solid rgba(148, 163, 184, 0.12);
`;

export const Title = styled("div")`
	font-weight: 900;
`;

export const CloseButton = styled("button")`
	width: 38px; height: 38px;
	
	display: inline-flex;
	align-items: center;
	justify-content: center;
  
	border-radius: 12px;
  	border: 1px solid var(--border);
  	background: rgba(148, 163, 184, 0.08);
  
	color: var(--text);
	font-size: 22px;
	line-height: 1;

	transition: border-color .1s;
	
	cursor: pointer;

  &:hover {
    border-color: rgba(148, 163, 184, 0.45);
  }
`;

export const Container = styled("div")`
	flex: 1 1 0;
	min-height: 0;
	overflow: hidden;
`;

export const PaginationArea = styled("div")`
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;

	padding-top: 10px;
	min-height: 42px;
`;

export const PaginationBtn = styled("button")`
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: 30px; height: 30px;

	border: 1px solid var(--border);
	border-radius: 8px;
	background: rgba(148, 163, 184, 0.08);

	color: var(--text);
	font-size: 14px;
	line-height: 1;
	cursor: pointer;

	transition: border-color 0.1s, background 0.1s;

	&:hover:not(:disabled) {
		border-color: rgba(148, 163, 184, 0.45);
		background: rgba(148, 163, 184, 0.14);
	}

	&:disabled {
		opacity: 0.3;
		cursor: default;
	}
`;

export const PaginationLabel = styled("span")`
	color: var(--muted);
	font-family: var(--mono);
	font-size: 12px;
	min-width: 48px;
	text-align: center;
`;

export const Footer = styled("div")`
	margin-top: auto;
	padding-top: 8px;
	
	border-top: 1px solid rgba(148, 163, 184, 0.12);
`;
