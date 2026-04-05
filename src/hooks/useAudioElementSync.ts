import { useEffect } from "react";
import { usePlayerStore } from "../store/playerStore";

export function useAudioElementSync(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const {
    volume,
    isMuted
  } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [audioRef, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [audioRef, isMuted]);
}

