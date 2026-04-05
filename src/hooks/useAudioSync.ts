import { useEffect, useRef } from "react";
import type { QueueState } from "../types/queue";

export function useAudioSync({
  audioRef,
  queue,
  streamBase,
  userInteractedRef,
  setIsPlayLoading,
  setError,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  queue: QueueState | null;
  streamBase: string;
  userInteractedRef: React.MutableRefObject<boolean>;
  setIsPlayLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
}) {
  const prevPausedRef = useRef<boolean | null>(null);
  const prevTrackUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPause = () => setIsPlayLoading(false);
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
  }, [audioRef, setIsPlayLoading]);

  useEffect(() => {
    const st = queue;
    const audio = audioRef.current;
    if (!audio || !st) return;

    const trackUrl = st.nowPlaying?.track?.url ?? null;
    const pausedNow = Boolean(st.paused);
    const pausedPrev = prevPausedRef.current;
    const trackPrev = prevTrackUrlRef.current;

    const shouldReconnect =
      (trackUrl && trackUrl !== trackPrev) || (pausedPrev === true && pausedNow === false);

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
      audio.src = `${streamBase}/stream?ts=${st.serverTimeMs}`;
      setIsPlayLoading(true);
    }

    if (audio.paused) {
      if (!userInteractedRef.current) {
        setIsPlayLoading(false);
        setError(null);
        return;
      }
      setIsPlayLoading(true);
      void audio.play().catch((e) => {
        setIsPlayLoading(false);
        setError(e instanceof Error ? e.message : String(e));
      });
    }
  }, [queue, streamBase, audioRef, userInteractedRef, setIsPlayLoading, setError]);
}
