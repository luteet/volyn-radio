import { createContext, useContext } from "react";
import type { useStickers } from "./hooks/useStickers";

export type StickersContextValue = ReturnType<typeof useStickers>;

export const StickersContext = createContext<StickersContextValue | null>(null);

export function useStickersContext(): StickersContextValue {
  const ctx = useContext(StickersContext);
  if (!ctx) throw new Error("useStickersContext must be used inside StickersProvider");
  return ctx;
}
