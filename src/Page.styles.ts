import { styled } from "@mui/material";

export const Background = styled("div")`

	position: absolute;
	top: 0; left: 0;

	width: 100%; height: 100%;

	z-index: -1;

	background-color: var(--bg);

	&::after {
		content: "";
		position: absolute;
		top: 0; left: 0;

		width: 100%; height: 100%;
		
		//background: radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 70%);
		box-shadow: inset 0 0 40vw 10vw rgba(0, 0, 0, 0.5);
	}
	
`;

export const BackgroundStickers = styled("div")`

	position: absolute;
	inset: 0;

	overflow: hidden;
	
`;

export const BackgroundImage = styled("div")`

	position: absolute;
	top: 0; left: 0;

	width: 100%; height: 100%;

	background: url("noise-abstract-texture.jpg") center / 500px repeat;
	mix-blend-mode: overlay;

	opacity: 0.5;
	
`;

export const BackgroundImages = styled("div")``;
