import { createContext, useContext } from "react";

export type ApiConfig = {
  apiOrigin: string;
  socketPath: string;
  streamBase: string;
};

export const ApiConfigContext = createContext<ApiConfig | null>(null);

export function useApiConfig() {
  const v = useContext(ApiConfigContext);
  if (!v) throw new Error("useApiConfig must be used within ApiConfigProvider");
  return v;
}

