import { styled } from "@mui/material";

export const Main = styled("div")`
	display: flex;
	flex-direction: column;
	gap: 6px;

	margin-top: 14px;
`;

export const Info = styled("div")`
	display: inline-flex;
	align-items: baseline;
	gap: 4px;

	color: var(--muted);
	font-size: 12px;

	span {
		&:nth-of-type(1) {
			color: var(--text);
		}

		&:nth-of-type(2) {
			opacity: 0.7;
		}

		&:nth-of-type(3) {
			opacity: 0.8;
		}
	}
`;

export const Bar = styled("div")`
	position: relative;

	width: 100%; height: 6px;

	border-radius: 16px;
	background: rgba(148, 163, 184, 0.25);
`;

export const BarFill = styled("div") <{ isPlaying: boolean }>`
	position: absolute;
	inset: 0;

	width: 0;

	background: linear-gradient(90deg, var(--accent-2), rgba(45, 212, 191, 0.5));
	border-radius: 16px;

	${({ isPlaying }) => isPlaying ? `
		transition: width 1s linear;

		&::before {
			content: "";
			
			position: absolute;
			right: -10px; top: 50%;
			transform: translate(0, -50%);

			width: 12px; height: 12px;

			background-color: var(--accent);
			border-radius: 50%;
			box-shadow: 0 0 10px var(--accent);
		}
	` : null}
`;
