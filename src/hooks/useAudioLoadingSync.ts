import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/playerStore";

const LOADER_DELAY_MS = 500;

export function useAudioLoadingSync(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const {
    isPlayPending,
    setIsPlayLoading,
    setIsPlayPending
  } = usePlayerStore();
  const timerRef = useRef<number | null>(null);

  // Control the delayed display of the loader using `pending`.
  useEffect(() => {
    if (isPlayPending) {
      if (timerRef.current == null) {
        timerRef.current = window.setTimeout(() => {
          setIsPlayLoading(true);
        }, LOADER_DELAY_MS);
      }
    } else {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsPlayLoading(false);
    }
  }, [isPlayPending, setIsPlayLoading]);

  // Audio events: completion of the play/pause operation.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const clearPendingAndLoader = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsPlayPending(false);
      setIsPlayLoading(false);
    };

    const handlePause = clearPendingAndLoader;
    const handleEnded = clearPendingAndLoader;
    const handlePlaying = clearPendingAndLoader;
    const handleError = clearPendingAndLoader;

    const handleWaiting = () => {
      // If buffering has started before the delay expires, display the loader immediately.
      if (isPlayPending) {
        if (timerRef.current != null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setIsPlayLoading(true);
      }
    };

    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
    };
  }, [audioRef, isPlayPending, setIsPlayPending, setIsPlayLoading]);
}

