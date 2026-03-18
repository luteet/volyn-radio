import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faForwardStep,
  faPause,
  faPlay,
  faTrash,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const apiBase = useMemo(() => {
    const fromEnv = import.meta.env.VITE_API_BASE as string | undefined;
    if (fromEnv) return fromEnv;
    // When opened from another device, "localhost" would be the phone itself.
    // Default to same host as the frontend, but backend port (3002).
    return `http://${window.location.hostname}:3002`;
  }, []);

  type QueueState = {
    nowPlaying: null | { track: Track };
    queued: Array<{ position: number; track: Track; addedAt: number }>;
    listeners: number;
    playing: boolean;
    paused: boolean;
    positionSeconds: number;
    serverTimeMs: number;
  };

  type Track = {
    id: string | null;
    url: string;
    title: string;
    duration: number; // seconds
  };

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayLoading, setIsPlayLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const volumeBeforeMuteRef = useRef<number>(0.8);
  const socketRef = useRef<Socket | null>(null);
  const [socketStatus, setSocketStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting"
  );
  const [isNextLoading, setIsNextLoading] = useState(false);
  const lastNowPlayingUrlRef = useRef<string | null>(null);
  const nextLoadingTimeoutRef = useRef<number | null>(null);
  const prevPausedRef = useRef<boolean | null>(null);
  const prevTrackUrlRef = useRef<string | null>(null);
  const userInteractedRef = useRef(false);

  type HelloPayload = QueueState;
  type EnqueueAck =
    | { ok: true; position: number; nowPlaying: QueueState["nowPlaying"]; track: Track }
    | { ok: false; error: string };
  type SimpleAck = { ok: true } | { ok: false; error: string };

  function formatDuration(totalSeconds: number | null | undefined) {
    if (typeof totalSeconds !== "number" || !Number.isFinite(totalSeconds) || totalSeconds < 0)
      return "—";
    const s = Math.floor(totalSeconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(sec).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
  }

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    setError(null);
    setSocketStatus("connecting");

    const socket = io(apiBase, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
    });
    socketRef.current = socket;

    const onConnect = () => setSocketStatus("connected");
    const onDisconnect = () => setSocketStatus("disconnected");
    const onConnectError = (e: Error) => {
      setSocketStatus("disconnected");
      setError(`Socket connect error: ${e.message} (apiBase: ${apiBase})`);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("hello", (state: HelloPayload) => {
      setQueue(state);
    });
    socket.on("state", (state: QueueState) => {
      const nextUrl = state.nowPlaying?.track?.url ?? null;
      if (isNextLoading && lastNowPlayingUrlRef.current !== nextUrl) {
        setIsNextLoading(false);
        if (nextLoadingTimeoutRef.current) {
          window.clearTimeout(nextLoadingTimeoutRef.current);
          nextLoadingTimeoutRef.current = null;
        }
      }
      lastNowPlayingUrlRef.current = nextUrl;
      setQueue(state);
    });
    socket.on("errorMessage", (payload: { ok: false; error: string }) => {
      setError(payload?.error || "Unknown error");
    });

    // Ask for current state in case hello is missed.
    socket.emit("getState");

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiBase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPause = () => {
      setIsPlayLoading(false);
    };
    const onWaiting = () => {
      if (!audio.paused) setIsPlayLoading(true);
    };
    const onPlaying = () => setIsPlayLoading(false);
    const onError = () => setIsPlayLoading(false);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const mark = () => {
      userInteractedRef.current = true;
    };
    window.addEventListener("pointerdown", mark, { once: true });
    window.addEventListener("keydown", mark, { once: true });
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  useEffect(() => {
    const st = queue;
    const audio = audioRef.current;
    if (!audio || !st) return;

    const trackUrl = st.nowPlaying?.track?.url ?? null;
    const pausedNow = Boolean(st.paused);
    const pausedPrev = prevPausedRef.current;
    const trackPrev = prevTrackUrlRef.current;

    // Track changed or resumed -> reconnect stream to align listeners.
    const shouldReconnect = (trackUrl && trackUrl !== trackPrev) || (pausedPrev === true && pausedNow === false);

    prevPausedRef.current = pausedNow;
    prevTrackUrlRef.current = trackUrl;

    if (!trackUrl) {
      if (!audio.paused) audio.pause();
      return;
    }

    if (pausedNow) {
      if (!audio.paused) audio.pause();
      return;
    }

    if (shouldReconnect) {
      // Force a fresh HTTP connection to reduce drift.
      audio.src = `${apiBase}/stream?ts=${st.serverTimeMs}`;
      setIsPlayLoading(true);
    }

    if (audio.paused) {
      if (!userInteractedRef.current) {
        setIsPlayLoading(false);
        setError("Tap Play to start audio on this device.");
        return;
      }
      setIsPlayLoading(true);
      void audio.play().catch((e) => {
        setIsPlayLoading(false);
        setError(e instanceof Error ? e.message : String(e));
      });
    }
  }, [queue, apiBase]);

  async function togglePlay() {
    setError(null);
    try {
      const socket = socketRef.current;
      if (!socket || socketStatus !== "connected") throw new Error("Socket is not connected");
      setIsPlayLoading(true);
      await new Promise((resolve) => {
        socket.emit("togglePause", (ack: unknown) => resolve(ack));
      });
      // If this click was a user gesture, try to start audio immediately (mobile autoplay rules).
      const audio = audioRef.current;
      if (audio && userInteractedRef.current) {
        void audio.play().catch(() => {});
      }
    } catch (e) {
      setIsPlayLoading(false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isMuted) {
      volumeBeforeMuteRef.current = volume;
      setIsMuted(true);
      return;
    }
    setIsMuted(false);
    if (volume === 0) setVolume(Math.max(0.15, volumeBeforeMuteRef.current || 0.8));
  }

  async function enqueue(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const url = youtubeUrl.trim();
    if (!url) return;
    setIsSubmitting(true);
    try {
      const socket = socketRef.current;
      if (!socket || socketStatus !== "connected") {
        throw new Error("Socket is not connected");
      }

      const ack: EnqueueAck = await new Promise((resolve) => {
        socket.emit("enqueue", { url }, (response: EnqueueAck) => resolve(response));
      });
      if (!ack.ok) throw new Error(ack.error);

      setYoutubeUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function nextTrack() {
    setError(null);
    try {
      const socket = socketRef.current;
      if (!socket || socketStatus !== "connected") throw new Error("Socket is not connected");
      setIsNextLoading(true);
      if (nextLoadingTimeoutRef.current) window.clearTimeout(nextLoadingTimeoutRef.current);
      nextLoadingTimeoutRef.current = window.setTimeout(() => {
        setIsNextLoading(false);
        nextLoadingTimeoutRef.current = null;
      }, 8000);
      await new Promise((resolve) => {
        socket.emit("next", (ack: unknown) => resolve(ack));
      });
    } catch (e) {
      setIsNextLoading(false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function clearQueue() {
    setError(null);
    if (!window.confirm("Stop playback and clear the queue?")) return;
    try {
      const socket = socketRef.current;
      if (!socket || socketStatus !== "connected") throw new Error("Socket is not connected");
      const ack: SimpleAck = await new Promise((resolve) => {
        socket.emit("clear", (response: SimpleAck) => resolve(response));
      });
      if (!ack.ok) throw new Error(ack.error);

      // Stop local audio too (server will stop, but this is instant UX).
      const audio = audioRef.current;
      if (audio) audio.pause();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const hasQueued = (queue?.queued?.length ?? 0) > 0;
  const hasNext = hasQueued;
  const isGloballyPaused = queue?.paused ?? true;
  const canStart = socketStatus === "connected" && (Boolean(queue?.nowPlaying?.track?.url) || hasQueued);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Volyn Radio</h1>
          <p className="muted">One stream, shared queue</p>
        </div>
        <div className="badgeRow">
          <span className="badge">Listeners: {queue?.listeners ?? "—"}</span>
          <span className="badge">{queue?.playing ? "Live" : "Idle"}</span>
          <span className="badge">Socket: {socketStatus}</span>
        </div>
      </header>

      <section className="card">
        <h2>Player</h2>
        <div className="nowPlaying">
          <div className="nowTitle" title={queue?.nowPlaying?.track?.title || ""}>
            {queue?.nowPlaying?.track?.title || "—"}
          </div>
          <div className="nowMeta">
            <span className="badge small">
              Duration: {formatDuration(queue?.nowPlaying?.track?.duration)}
            </span>
          </div>
        </div>
        <div className="player">
          <div className="playerLeft">
            <button
              className="iconButton"
              type="button"
              onClick={togglePlay}
              disabled={isPlayLoading || !canStart}
              title={isGloballyPaused ? "Play" : "Pause"}
              aria-label={isGloballyPaused ? "Play" : "Pause"}
            >
              <span className="btnContent">
                {isPlayLoading ? (
                  <span className="spinner" aria-hidden="true" />
                ) : (
                  <FontAwesomeIcon icon={isGloballyPaused ? faPlay : faPause} size="lg" />
                )}
              </span>
            </button>
            <button
              className="iconButton secondary"
              type="button"
              onClick={nextTrack}
              disabled={!queue?.nowPlaying?.track?.url || !hasNext || isNextLoading}
              title="Next"
              aria-label="Next"
            >
              <span className="btnContent">
                {isNextLoading ? (
                  <span className="spinner" aria-hidden="true" />
                ) : (
                  <FontAwesomeIcon icon={faForwardStep} size="lg" />
                )}
              </span>
            </button>
            <button
              className="iconButton danger"
              type="button"
              onClick={clearQueue}
              disabled={!queue?.nowPlaying?.track?.url && !(queue?.queued?.length)}
              title="Clear queue"
              aria-label="Clear queue"
            >
              <span className="btnContent">
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </span>
            </button>
          </div>
          <div className="volume">
            <button
              className="volumeButton"
              type="button"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              <FontAwesomeIcon icon={isMuted || volume === 0 ? faVolumeXmark : faVolumeHigh} size="lg" />
            </button>
            <input
              className="slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (v > 0 && isMuted) setIsMuted(false);
              }}
            />
          </div>
          <audio ref={audioRef} preload="none" src={`${apiBase}/stream`} />
        </div>
        <p className="muted">Late joiners start from the current moment (radio mode).</p>
      </section>

      <section className="card">
        <h2>Add to queue</h2>
        <form className="form" onSubmit={enqueue}>
          <input
            className="input"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="button" type="submit" disabled={isSubmitting || !youtubeUrl.trim()}>
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="card">
        <h2>Queue</h2>
        <div className="queueBlock">
          <ol className="list">
            {(queue?.queued || []).map((q) => (
              <li key={`${q.addedAt}-${q.track.url}`} className="queueItem">
                <div className="queueTitle" title={q.track.title}>
                  {q.track.title}
                </div>
                <div className="queueDuration">{formatDuration(q.track.duration)}</div>
              </li>
            ))}
          </ol>
          {!queue?.queued?.length ? <p className="muted">Queue is empty.</p> : null}
        </div>
      </section>

      <footer className="footer">
        <p className="muted mono">Volyn Radio — v0.1.0 (early preview)</p>
      </footer>
    </div>
  );
}

export default App;
