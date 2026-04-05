import { styled } from "@mui/material";

export const Item = styled("div")`
	font-family: var(--mono);
	font-size: 12px;
	padding: 6px 10px;
	border: 1px solid var(--border);
	border-radius: 999px;
	background: var(--card);
	color: var(--muted);

	.loading {
		animation: loading 2s ease 0s infinite normal forwards;
	}
`;

export const SmallItem = styled(Item)`
	font-size: 11px;
	padding: 5px 8px;
`;

export const Row = styled("div")`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 8px;
`;
