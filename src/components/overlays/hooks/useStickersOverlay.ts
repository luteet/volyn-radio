
import { useAppStore } from "../../../store/appStore";
import { useStickersStore } from "../../../store/stickersStore";
import { useCallback, useEffect } from "react";
import type { Sticker } from "../../../types/stickers";

const useStickersOverlay = () => {

	// Stores
	const { api, isOpenPopup, setIsOpenPopup, } = useAppStore();
	const { isPlacing, } = useStickersStore();

	// Base URL
	const stickerImagesBase = api ? `${api.apiOrigin}/api/sticker-images` : "";
	const stickersApiBase = api ? `${api.apiOrigin}/api` : "";

	// Handles
	const handleClose = useCallback(() => {
		setIsOpenPopup(null);
	}, [setIsOpenPopup]);

	// Effects
	// Get data
	useEffect(() => {
		if (!api || !stickersApiBase) return;
		(async () => {
			try {
				const resp = await fetch(`${stickersApiBase}/stickers`, { method: "GET" });
				if (!resp.ok) return;
				const json = (await resp.json()) as { stickers?: Sticker[] };
				if (!Array.isArray(json?.stickers)) return;
				useStickersStore.getState().setStickers(json.stickers);
			} catch { /* empty */ }
		})();
	}, [api, stickersApiBase]);

	// Public
	return {
		isOpen: isOpenPopup === "stickers-uploader" && !isPlacing,
		stickersApiBase, stickerImagesBase,

		handleClose
	}
}

export default useStickersOverlay;