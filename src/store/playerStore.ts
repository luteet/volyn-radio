import { create } from "zustand";
import type { EnqueueAck, QueueState, SimpleAck, Track } from "../types/queue";
import { useAppStore } from "./appStore";
import { toast } from "react-toastify";

type State = {

  queue: QueueState | null;
  error: string | null;

  youtubeUrl: string;
  isSubmitting: boolean;
  submittingTracks: Set<string>;

  isPlaying: boolean;
  isPlayLoading: boolean;
  isPlayPending: boolean;
  isNextLoading: boolean;
  isPlayToggle: boolean;
  isTrackEnding: boolean;

  volume: number;
  isMuted: boolean;

  showJoinPopup: boolean;
  hasUserInteracted: boolean;
  hasEverConnected: boolean;
  reconnectRevision: number;
};

type Actions = {
  togglePlay: (audio?: HTMLAudioElement | null) => Promise<void>;
  enqueue: () => Promise<void>;
  addTrackToEnqueue: (track: Track) => Promise<void>;
  nextTrack: () => Promise<void>;
  clearQueue: (audio?: HTMLAudioElement | null) => Promise<void>;
  setIsPlayToggle: (is: boolean) => void;

  connectSocket: () => void;

  setYoutubeUrl: (v: string) => void;

  setVolume: (v: number) => void;
  toggleMute: () => void;

  markUserInteracted: () => void;
  joinListening: (audio?: HTMLAudioElement | null) => Promise<void>;

  setShowJoinPopup: (v: boolean) => void;
  setError: (v: string | null) => void;
  setIsPlayLoading: (v: boolean) => void;
  setIsPlayPending: (v: boolean) => void;
  setIsNextLoading: (v: boolean) => void;
  applyQueueState: (state: QueueState) => void;
};

// Internal refs, kept out of React render cycle.
let volumeBeforeMute = 0.8;
let nextLoadingTimeout: number | null = null;

export const usePlayerStore = create<State & Actions>((set, get) => ({
  api: null,
  socketStatus: "connecting",
  discord: { status: "connecting" },

  queue: null,
  error: null,

  isPlaying: false,
  youtubeUrl: "",
  isSubmitting: false,
  submittingTracks: new Set<string>(),

  isPlayLoading: false,
  isPlayPending: false,
  isNextLoading: false,
  isPlayToggle: false,
  isTrackEnding: false,

  volume: 0.1,
  isMuted: false,

  showJoinPopup: false,
  hasUserInteracted: false,
  hasEverConnected: false,
  reconnectRevision: 0,

  setIsPlayToggle: (value: boolean) => {
    set({ isPlayToggle: value })
  },

  connectSocket: () => {
    const { api, socketRef } = useAppStore.getState();

    if (!api) return () => { };
    if (!socketRef) return () => { };

    socketRef.on("hello", (state: QueueState) => {
      const wasEverConnected = get().hasEverConnected;
      set({ hasEverConnected: true });
      get().applyQueueState(state);
      // On reconnect to an active session — show JoinPopup and trigger stream reconnect.
      if (wasEverConnected && state.nowPlaying?.track && !state.paused) {
        set((s) => ({ showJoinPopup: true, reconnectRevision: s.reconnectRevision + 1 }));
      }
    });
    socketRef.on("state", (state: QueueState) => get().applyQueueState(state));
    socketRef.on("progress", (state: QueueState) => get().applyQueueState(state));

    socketRef.on("errorMessage", (payload: { ok: false; error: string }) => {
      set({ error: payload?.error || "Unknown error" });
    });

    socketRef.on("trackEnding", () => {
      set({ isTrackEnding: true });
    });

    socketRef.emit("getState");
  },

  applyQueueState: (state) => {
    const prevUrl = get().queue?.nowPlaying?.track?.url ?? null;
    const nextUrl = state.nowPlaying?.track?.url ?? null;

    if (get().isNextLoading && prevUrl !== nextUrl) {
      set({ isNextLoading: false });
      if (nextLoadingTimeout) {
        window.clearTimeout(nextLoadingTimeout);
        nextLoadingTimeout = null;
      }
    }
    if (prevUrl !== nextUrl && nextUrl) {
      setTimeout(() => set({ isTrackEnding: false }), 2000);
    }
    const isPaused = Boolean(state.paused);
    if (isPaused) {
      set({ queue: state, isPlaying: false, isPlayPending: false, isPlayLoading: false });
      return;
    }
    const hasTrack = Boolean(state.nowPlaying?.track?.url);
    set({ queue: state, isPlaying: hasTrack && !isPaused });
  },

  setYoutubeUrl: (v) => set({ youtubeUrl: v }),

  setVolume: (v) => {
    set({ volume: v });
    if (v > 0 && get().isMuted) set({ isMuted: false });
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    if (!isMuted) {
      volumeBeforeMute = volume;
      set({ isMuted: true });
      return;
    }
    set({ isMuted: false });
    if (volume === 0) set({ volume: Math.max(0.15, volumeBeforeMute || 0.8) });
  },

  setShowJoinPopup: (v) => set({ showJoinPopup: v }),
  setError: (v) => set({ error: v }),
  setIsPlayLoading: (v) => set({ isPlayLoading: v }),
  setIsPlayPending: (v) => set({ isPlayPending: v }),
  setIsNextLoading: (v) => set({ isNextLoading: v }),

  markUserInteracted: () => {
    set({ hasUserInteracted: true });
  },

  joinListening: async (audio) => {
    get().markUserInteracted();
    set({ showJoinPopup: false, error: null });
    if (!audio) return;
    try {
      await audio.play();
      set({ isPlayLoading: false });
    } catch (e) {
      set({ isPlayLoading: false, error: e instanceof Error ? e.message : String(e) });
    }
  },

  togglePlay: async (audio) => {
    set({ error: null });
    try {
      const state = get();
      const { socketRef, socketStatus } = useAppStore.getState();

      if (state.isPlayToggle) return;
      state.setIsPlayToggle(true);

      const hasTrack = Boolean(state.queue?.nowPlaying?.track?.url);
      const hasQueued = (state.queue?.queued?.length ?? 0) > 0;
      // There’s nothing to boot – we don’t start the loader and we don’t touch the socket.
      if (!hasTrack && !hasQueued) {
        return;
      }
      if (!socketRef || socketStatus !== "connected") {
        throw new Error("Socket is not connected");
      }
      // Request in progress: mark as pending, and the actual loader
      // We’ll only display it if the operation takes a long time (via a hook).
      set({ isPlayPending: true });
      const ack = (await new Promise((resolve) => {
        socketRef?.emit("togglePause", (reply: { ok: boolean; paused?: boolean } | undefined) =>
          resolve(reply),
        );
      })) as { ok: boolean; paused?: boolean } | undefined;

      set({ isPlayToggle: false });

      // If the backend says the player is now paused, we don’t touch audio.play().
      if (ack?.paused === true) {
        if (audio) {
          audio.pause();
        }
        return;
      }

      // If the player has switched to the ‘playing’ state and a user gesture has been detected –
      // Let’s try playing it.
      if (audio && get().hasUserInteracted) {
        void audio.play().catch(() => { });
      }
    } catch (e) {
      set({ isPlayLoading: false, isPlayToggle: false, error: e instanceof Error ? e.message : String(e) });
    }
  },

  enqueue: async () => {
    set({ error: null });
    const { socketRef, socketStatus, setError } = useAppStore.getState();
    const url = get().youtubeUrl.trim();
    if (!url) return;
    set({ isSubmitting: true });
    try {
      if (!socketRef || socketStatus !== "connected") throw new Error("Socket is not connected");
      const ack: EnqueueAck = await new Promise((resolve) => {
        socketRef?.emit("enqueue", { url }, (response: EnqueueAck) => resolve(response));
      });
      if (!ack.ok) {
        setError(ack.error);
        throw new Error(ack.error);
      } else {
        setError("");
      }
      set({ youtubeUrl: "" });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      set({ isSubmitting: false });
    }
  },

  addTrackToEnqueue: async (track: Track) => {
    if (!track.id) return;
    const { socketRef, socketStatus } = useAppStore.getState();
    set(s => ({ submittingTracks: new Set(s.submittingTracks).add(track.id!) }));
    try {
      if (!socketRef || socketStatus !== "connected") throw new Error("Socket is not connected");
      const ack: EnqueueAck = await new Promise((resolve) => {
        socketRef?.emit("enqueue", { url: track.url }, (response: EnqueueAck) => resolve(response));
      });
      if (!ack.ok) throw new Error(ack.error);
      else toast.success("The track has been added to the queue");
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      set(s => {
        const next = new Set(s.submittingTracks);
        next.delete(track.id!);
        return { submittingTracks: next };
      });
    }
  },

  nextTrack: async () => {
    set({ error: null });
    const { socketRef, socketStatus } = useAppStore.getState();
    try {
      if (!socketRef || socketStatus !== "connected") throw new Error("Socket is not connected");
      set({ isNextLoading: true });
      if (nextLoadingTimeout) window.clearTimeout(nextLoadingTimeout);
      nextLoadingTimeout = window.setTimeout(() => {
        set({ isNextLoading: false });
        nextLoadingTimeout = null;
      }, 8000);
      await new Promise((resolve) => {
        socketRef?.emit("next", (ack: unknown) => resolve(ack));
      });
    } catch (e) {
      set({ isNextLoading: false, error: e instanceof Error ? e.message : String(e) });
    }
  },

  clearQueue: async (audio) => {
    set({ error: null });
    const { socketRef, socketStatus } = useAppStore.getState();
    if (!window.confirm("Stop playback and clear the queue?")) return;
    try {
      if (!socketRef || socketStatus !== "connected") throw new Error("Socket is not connected");
      const ack: SimpleAck = await new Promise((resolve) => {
        socketRef?.emit("clear", (response: SimpleAck) => resolve(response));
      });
      if (!ack.ok) throw new Error(ack.error);
      if (audio) {
        // Force-stop audio and clear pending buffered data.
        // This helps the backend stream consumer drop old buffered chunks.
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e) });
    }
  },
}));
