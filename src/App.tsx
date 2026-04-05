import { Aside } from "./components/overlays/Aside";
import { ToastContainer } from 'react-toastify';
import { GlobalThemeProvider } from "./GlobalTheme";
import * as S from "./Page.styles"
import { useAppInit } from "./hooks/useAppInit";
import { useEffect, useMemo } from "react";
import { useAppStore } from "./store/appStore";
import { ApiConfigProvider } from "./contexts/ApiConfigContext";

const useApp = () => {

	// App config
	const setApi = useAppStore((s) => s.setApi);

	// Derive API config from env or window.location
	const apiBase = useMemo(() => {
		const fromEnv = import.meta.env.VITE_API_BASE as string | undefined;
		if (fromEnv) return fromEnv;
		return window.location.origin;
	}, []);

	const apiParts = useMemo(() => {
		try {
			const u = new URL(apiBase);
			let prefix = u.pathname.replace(/\/$/, "");
			// Backward/forward compatibility:
			// Backend moved from `/api/*` to `/api/player/*`.
			// If env still points to `/api`, transparently upgrade it.
			if (prefix === "/api") prefix = "/api/player";
			return { origin: u.origin, prefix };
		} catch {
			return { origin: window.location.origin, prefix: "" };
		}
	}, [apiBase]);

	// Derived
	const apiOrigin = apiParts.origin;
	const apiPrefix = apiParts.prefix; // "" or "/api"
	const socketPath = apiPrefix ? `${apiPrefix}/socket.io` : "/socket.io";
	const streamBase = apiPrefix ? `${apiOrigin}${apiPrefix}` : apiOrigin;

	// Effects
	useEffect(() => {
		setApi({ apiOrigin, socketPath, streamBase });
	}, [apiOrigin, socketPath, streamBase, setApi]);

	// Init
	useAppInit();

	// Public
	return {
		apiOrigin,
		socketPath,
		streamBase
	}
}

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
