import { useCallback, useEffect, useRef } from "react";
import { useAppStore } from "../../../store/appStore";
import { usePlayerStore } from "../../../store/playerStore";
import { useStickersStore } from "../../../store/stickersStore";

const useAside = () => {

	// App store and player/stickers stores
	const { api, isOpenPopup, setIsOpenPopup } = useAppStore();
	const { queue } = usePlayerStore();
	const isPlaying = Boolean(queue?.nowPlaying?.track?.url) && !queue?.paused;
	const playerTooltipTitle = isOpenPopup !== "player" && isPlaying ? queue?.nowPlaying?.track?.title : null;

	const {
		stickers,
		isPlacing
	} = useStickersStore();

	// Refs
	const asideRef = useRef<HTMLDivElement>(null);

	// Handlers for closing the popups when pressing Escape or clicking outside
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsOpenPopup(null);
		}
	}, [setIsOpenPopup]);

	const handleClick = useCallback((e: MouseEvent) => {
		if (!asideRef.current) return;
		// Use composedPath() instead of contains(e.target) so that clicks on elements
		// that unmount themselves (e.g. JoinPopup closing on click) are not treated as
		// outside clicks — e.target may already be detached from the DOM by the time
		// the document.body listener fires.
		if (!e.composedPath().includes(asideRef.current)) {
			setIsOpenPopup(null);
		}
	}, [setIsOpenPopup]);

	// Effects for adding event listeners for the above handlers, and for fetching stickers when the API becomes available
	useEffect(() => {

		window.addEventListener("keydown", handleKeyDown);
		document.body.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.removeEventListener("click", handleClick);
		}

	}, [handleKeyDown, handleClick]);

	// Public
	return {
		asideRef,

		playerTooltipTitle,

		api,
		stickers,

		isPlaying, isPlacing, isOpenPopup,

		setIsOpenPopup
	}
}

export default useAside;
