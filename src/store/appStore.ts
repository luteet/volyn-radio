import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { DiscordInitState } from "../discord";
import { initDiscord, isRunningInDiscord } from "../discord";

export type SocketStatus = "connecting" | "connected" | "disconnected";

type PopupOpenStatus = "player" | "player-history" | "stickers-uploader" | null;

export type ApiConfig = {
  apiOrigin: string;
  socketPath: string;
  streamBase: string;
};

type State = {
  api: ApiConfig | null;
  socketRef: Socket | null;
  socketStatus: SocketStatus;
  discord: DiscordInitState;
  error: string | null;
  isOpenPopup: PopupOpenStatus;
  setIsOpenPopup: (value: PopupOpenStatus) => void
};

type Actions = {
  setApi: (api: ApiConfig) => void;
  setError: (message: string) => void;
  initDiscord: () => void;
  connectSocket: (onConnected: () => void) => () => void;
};

export const useAppStore = create<State & Actions>((set, get) => ({
  api: null,
  socketRef: null,
  socketStatus: "connecting",
  discord: { status: "connecting" },
  error: null,

  isOpenPopup: null,
  setIsOpenPopup: (isOpenPopup) => set({ isOpenPopup }),

  setApi: (api) => set({ api }),

  setError: (message: string) => set({ error: message }),

  initDiscord: () => {
    void initDiscord()
      .then((st) => set({ discord: st }))
      .catch(() => set({ discord: { status: "not_in_discord" } }));
  },

  connectSocket: (onConnected) => {
    const api = get().api;
    if (!api) return () => { };

    // Defer state update to satisfy react-hooks/set-state-in-effect rule.
    queueMicrotask(() => set({ socketStatus: "connecting" }));

    const inDiscord = isRunningInDiscord();
    const socket = io(api.apiOrigin, {
      path: api.socketPath,
      transports: inDiscord ? ["polling"] : ["websocket", "polling"],
      upgrade: !inDiscord,
      withCredentials: false,
      autoConnect: true,
      reconnection: true,
    });

    set({ socketRef: socket });

    const onConnect = () => {
      set({ socketStatus: "connected" });
      onConnected();
    };

    const onDisconnect = () => {
      set({ socketStatus: "disconnected" });
    };

    const onConnectError = (e: Error) => {
      set({
        socketStatus: "disconnected",
        error: `Socket connect error: ${e.message} (origin: ${api.apiOrigin}, path: ${api.socketPath})`,
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("errorMessage", (payload: { ok: false; error: string }) => {
      set({ error: payload?.error || "Unknown error" });
    });

    socket.emit("getState");

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
      set({ socketRef: null });
    };
  },

}));

