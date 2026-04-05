import { AudioContext } from "./audio";

export function AudioProvider({
  audioRef,
  children,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  children: React.ReactNode;
}) {
  return <AudioContext.Provider value={{ audioRef }}>{children}</AudioContext.Provider>;
}

