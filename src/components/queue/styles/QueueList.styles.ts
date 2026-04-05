import { styled } from "@mui/material";

export const List = styled("ul")`
	margin: 0;
	padding-left: 0;

	list-style: none;
`;

export const ItemInner = styled("div")`
	position: relative;

	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;

	width: 100%; min-height: 40px;

	padding: 10px 12px;

	border: 1px solid var(--border);
	border-radius: 10px;
	background: rgba(2, 6, 23, 0.2);

	text-align: start;

	&:is(button) {
		cursor: pointer;

		padding-left: 0;

		transition:
		opacity 0.2s,
		padding-left 0.2s;

		&:hover {
			padding-left: 12px;

			.icon {
				opacity: 1;
				margin-right: 0;
			}
		}

		&[aria-busy="true"] {
			padding-left: 12px;

			opacity: 0.5;
			pointer-events: none;
		}

		&[aria-busy="true"] .icon {
			opacity: 1;
			margin-right: 0;
		}
	}
`;

export const Icon = styled("i")`
	display: inline-block;

	width: 14px; height: 14px; flex: 0 0 14px;

	margin-right: -14px;

	text-align: center;
	
	opacity: 0;

	transition:
		opacity 0.2s,
		margin-right 0.2s;
`;

export const Item = styled("li")`
	&:not(:first-of-type) {
		margin-top: 8px;
	}
`;

export const Title = styled("div")`
	flex: 1 1 auto;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--text);
	font-family: var(--mono);
	font-size: 13px;
`;

export const Duration = styled("div")`
	flex: 0 0 auto;

	color: var(--muted);
	font-family: var(--mono);
	font-size: 13px;
`;
