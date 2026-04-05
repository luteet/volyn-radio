import type { FC } from "react";
import type { CSSProperties } from "@mui/material";
import { Main } from "./styles/Spinner.styles";

const Spinner: FC<{ theme?: string }> = ({ theme }) => {
	return (
		<Main
			aria-hidden="true"
			style={theme ? { "--theme": theme } as CSSProperties : undefined}
		/>
	);
}

export default Spinner;
