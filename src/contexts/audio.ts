import { createContext, useContext } from "react";

export type AudioCtx = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
};

export const AudioContext = createContext<AudioCtx | null>(null);

export function useAudio() {
  const v = useContext(AudioContext);
  if (!v) throw new Error("useAudio must be used within AudioProvider");
  return v;
}

