import { styled } from "@mui/material";

export const Main = styled("div")`
	position: fixed;
	inset: 14px;

	display: flex;
	align-items: flex-end;
	justify-content: center;
	
	z-index: 25;

	pointer-events: none;
`;

export const Content = styled("div")`
	width: 100%;
	max-width: 520px;
	
	padding: 18px 22px;

	border-radius: 14px;
	border: 1px solid rgba(148, 163, 184, 0.5);
	background: var(--card)
		radial-gradient(circle at top left, rgba(45, 212, 191, 0.14), rgba(15, 23, 42, 0.96));
	box-shadow:
		0 18px 45px rgba(15, 23, 42, 0.85),
		0 0 0 1px rgba(15, 23, 42, 0.9);

	pointer-events: auto;
`;

export const Title = styled("div")`
	font-size: 12px;
	font-family: var(--mono);
	color: rgba(148, 163, 184, 0.95);
	margin-bottom: 4px;
`;

export const About = styled("div")`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;

	width: 100%;
`;

export const Track = styled("div")`
	margin-bottom: 6px;

	font-weight: 600;
	color: var(--text);
	font-size: 14px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const Meta = styled("div")`
	margin-bottom: 10px;

  	white-space: nowrap;
`;

export const Footer = styled("div")`
	padding-top: 16px;
`;
