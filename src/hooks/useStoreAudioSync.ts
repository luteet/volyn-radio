import { useEffect, useRef } from "react";
import { useApiConfig } from "../contexts/apiConfig";
import { usePlayerStore } from "../store/playerStore";

export function useStoreAudioSync(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const { streamBase } = useApiConfig();
  const {
    queue,
    hasUserInteracted,
    setIsPlayLoading,
    setError
  } = usePlayerStore();
  const userInteractedRef = useRef(false);
  const blockedAutoplayHandledRef = useRef(false);
  useEffect(() => {
    if (hasUserInteracted) userInteractedRef.current = true;
  }, [hasUserInteracted]);

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
    const audio = audioRef.current;
    if (!audio || !queue) return;

    const trackUrl = queue.nowPlaying?.track?.url ?? null;
    const pausedNow = Boolean(queue.paused);
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
      audio.src = `${streamBase}/stream?ts=${queue.serverTimeMs}`;
      setIsPlayLoading(true);
    }

    if (audio.paused) {
      if (!userInteractedRef.current) {
        // Autoplay is disabled — let’s reset the loader once and clear the error,
        // Then we simply exit without any new set* commands, so as not to get stuck in a loop.
        if (!blockedAutoplayHandledRef.current) {
          blockedAutoplayHandledRef.current = true;
          setIsPlayLoading(false);
          setError(null);
        }
        return;
      }
      setIsPlayLoading(true);
      void audio.play().catch((e) => {
        setIsPlayLoading(false);
        setError(e instanceof Error ? e.message : String(e));
      });
    }
  }, [audioRef, queue, streamBase, setIsPlayLoading, setError]);
}
