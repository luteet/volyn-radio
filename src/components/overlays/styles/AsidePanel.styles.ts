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
	display: flex;
	flex-direction: column;
	
	height: 100%;
	
	padding: 14px;
	
	overflow: auto;

	scrollbar-width: thin;
	scrollbar-color: var(--card) var(--bg);
	
	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-track {
		background: var(--bg);
	}
	&::-webkit-scrollbar-thumb {
		background: var(--card);
		border-radius: 4px;
	}
`;

export const Header = styled("div")`
	position: sticky;
	top: 0;
	z-index: 2;

	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 10px 2px 14px;
	margin-bottom: 14px;

	&::before {
		content: "";
		position: absolute;
		left: 0; top: -14px;

		width: 100%; height: 100%;

		background-color: var(--bg);
		box-shadow: 0 0 20px 20px var(--bg);

		z-index: -1;
	}
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

export const Container = styled("div")``;

export const Footer = styled("div")`
	margin-top: auto;
	padding-top: 8px;
	
	border-top: 1px solid rgba(148, 163, 184, 0.12);
`;
