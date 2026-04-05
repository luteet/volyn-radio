import { create } from "zustand";
import type { Track } from "../types/queue";

type PlayerHistoryState = {
  isPlayerHistoryPopupActive: boolean
  playerHistory: Track[]
  setIsPlayerHistoryPopupActive: (is: boolean) => void
  setPlayerHistory: (data: Track[]) => void
};

export const usePlayerHistoryStore = create<PlayerHistoryState>((set) => ({
  isPlayerHistoryPopupActive: false,
  playerHistory: [],
  setIsPlayerHistoryPopupActive: (isPlayerHistoryPopupActive) => set({ isPlayerHistoryPopupActive }),
  setPlayerHistory: (playerHistory) => set({ playerHistory }),
}));

