import { useEffect, useMemo } from "react";
import { useAppStore } from "../store/appStore";
import { usePlayerStore } from "../store/playerStore";
import { useAppInit } from "./useAppInit";

const useApp = () => {

	// App config
	const { setApi } = useAppStore();
	const { queue, isPlaying } = usePlayerStore();
	const currentTrack = isPlaying ? queue?.nowPlaying?.track ?? null : null;

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

	useEffect(() => {
		if (currentTrack) {
			document.title = `${import.meta.env.VITE_APP_NAME} - Playing: ${currentTrack.title}`;
		} else {
			document.title = import.meta.env.VITE_APP_NAME;
		}
	}, [currentTrack])

	// Init
	useAppInit();

	// Public
	return {
		apiOrigin,
		socketPath,
		streamBase
	}
}

export default useApp;
