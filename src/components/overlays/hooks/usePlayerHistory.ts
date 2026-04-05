import { useCallback, useEffect } from "react";
import { useAppStore } from "../../../store/appStore";
import { usePlayerHistoryStore } from "../../../store/playerHistoryStore";
import type { Track } from "../../../types/queue";

const usePlayerHistory = () => {

	// Store
	const {
		api,
		socketRef,
		isOpenPopup, setIsOpenPopup
	} = useAppStore();

	// Data
	const data = usePlayerHistoryStore(s => s.playerHistory);
	const setData = usePlayerHistoryStore(s => s.setPlayerHistory);

	// API
	const getData = useCallback(async () => {
		if (!api) return;

		try {
			const resp = await fetch(`${api.apiOrigin}/api/player/history`, { method: "GET" });
			if (!resp.ok) return;
			const json = (await resp.json()) as { data?: Track[] };
			if (!Array.isArray(json?.data)) return;
			setData(json?.data);
		} catch { /* empty */ }
	}, [api, setData]);

	// Handles
	const handleClose = () => {
		setIsOpenPopup(null);
	}

	const handleOnEnqueued = useCallback((data: { ok: boolean }) => {
		if (data.ok) getData();
	}, [getData]);


	// Effects
	useEffect(() => {
		getData();
	}, [getData]);

	useEffect(() => {
		if (!socketRef) return;
		socketRef.on("enqueued", handleOnEnqueued);

		return () => {
			socketRef.off("enqueued", handleOnEnqueued);
		}
	}, [handleOnEnqueued, socketRef]);

	// Public
	return {
		data,
		isOpenPopup,

		handleClose
	}

}

export default usePlayerHistory;
