import type { ReactNode } from "react";
import { StickersContext, type StickersContextValue } from "./stickersContextDef";

export function StickersProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: StickersContextValue;
}) {
  return <StickersContext.Provider value={value}>{children}</StickersContext.Provider>;
}
