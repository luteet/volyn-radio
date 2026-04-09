import { styled } from "@mui/material";

export const Main = styled("section")`
	padding-bottom: 16px;
`;

export const NowPlaying = styled("div")`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 16px;

	padding-bottom: 14px;

	border-bottom: 1px solid rgba(148, 163, 184, 0.12);

	@media (max-width: 520px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}
`;

export const NowPlayingTitle = styled("a")`
	flex: 1 1 auto;

	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: 500;
	color: var(--text);
	font-size: 18px;
	text-decoration: none;

	overflow: hidden;

	@media (max-width: 520px) {
		display: -webkit-box;

		max-width: 100%;

		white-space: normal;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-word;
		
		overflow-wrap: anywhere;
		overflow: hidden;
	}
`;

export const Controls = styled("div")`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: space-between;
	gap: 24px;

	width: 100%;

	margin-top: 18px;

	@media (max-width: 520px) {
		gap: 16px;
	}
`;

export const ControlsRow = styled("div")`
	display: flex;
	align-items: center;
	gap: 10px;
`;
