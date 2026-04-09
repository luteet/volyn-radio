import * as S from "./Page.styles"
import { Aside } from "./components/overlays/Aside";
import { ToastContainer } from 'react-toastify';
import { GlobalThemeProvider } from "./GlobalTheme";
import { ApiConfigProvider } from "./contexts/ApiConfigContext";
import useApp from "./hooks/useApp";

export default function App() {

	const {
		apiOrigin, socketPath, streamBase
	} = useApp();

	return (
		<GlobalThemeProvider>
			<ApiConfigProvider value={{ apiOrigin, socketPath, streamBase }}>
				<div className="wrapper">
					<S.Background>
						<S.BackgroundImages />
						<S.BackgroundImage />
						<S.BackgroundStickers />
					</S.Background>
					<Aside />
					<ToastContainer
						icon={false}
						hideProgressBar={true}
						position="top-left"
						theme="dark"
					/>
				</div>
			</ApiConfigProvider>
		</GlobalThemeProvider>
	);
}
