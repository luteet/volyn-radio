import { create } from "zustand";
import type { Sticker } from "../types/stickers";
import { useAppStore } from "./appStore";

type StickersState = {
	stickers: Sticker[];
	isPlacing: boolean;
	connectSocket: () => void;
	setStickers: (stickers: Sticker[]) => void;
	setIsPlacing: (v: boolean) => void;
	clearStickers: () => void;
};

export const useStickersStore = create<StickersState>((set, get) => ({
	stickers: [],
	isPlacing: false,
	connectSocket: () => {
		const { socketRef } = useAppStore.getState();
		if (!socketRef) return () => { };

		socketRef.on("stickersUpdated", (payload: { stickers?: Sticker[] }) => {
			const stickers = payload?.stickers ?? [];
			get().setStickers(stickers);
		});
	},
	setStickers: (stickers) => set({ stickers }),
	setIsPlacing: (v) => set({ isPlacing: v }),
	clearStickers: () => set({ stickers: [] }),
}));

