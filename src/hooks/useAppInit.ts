import { useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { usePlayerStore } from "../store/playerStore";
import { useStickersStore } from "../store/stickersStore";

export function useAppInit() {

	// Stores
	const {
		api,
		initDiscord,
		connectSocket,
	} = useAppStore();
	const markUserInteracted = usePlayerStore((s) => s.markUserInteracted);
	const apiSocketPath = api?.socketPath;
	const apiOrigin = api?.apiOrigin;
	const apiStreamBase = api?.streamBase;

	const connectSocketPlayer = usePlayerStore(s => s.connectSocket);
	const connectSocketStickers = useStickersStore(s => s.connectSocket);

	// Effects
	useEffect(() => {
		initDiscord();
	}, [initDiscord]);

	useEffect(() => {
		if (!apiSocketPath) return;
		const cleanup = connectSocket(
			() => {
				connectSocketPlayer();
				connectSocketStickers();
			}
		);
		return cleanup;

	}, [connectSocket, apiSocketPath, apiOrigin, apiStreamBase, connectSocketPlayer, connectSocketStickers]);

	useEffect(() => {
		const mark = () => markUserInteracted();
		window.addEventListener("pointerdown", mark, { once: true });
		window.addEventListener("keydown", mark, { once: true });
		return () => {
			window.removeEventListener("pointerdown", mark);
			window.removeEventListener("keydown", mark);
		};
	}, [markUserInteracted]);
}
