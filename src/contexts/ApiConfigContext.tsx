import { ApiConfigContext, type ApiConfig } from "./apiConfig";

export function ApiConfigProvider({
  value,
  children,
}: {
  value: ApiConfig;
  children: React.ReactNode;
}) {
  return <ApiConfigContext.Provider value={value}>{children}</ApiConfigContext.Provider>;
}

