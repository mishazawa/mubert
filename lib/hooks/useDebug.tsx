import { createContext, useContext, type ReactNode } from "react";

const DebugContext = createContext<Record<string, any> | null>(null);

export function useDebug(key: string, fallback: any) {
  const context = useContext(DebugContext);
  if (!context) {
    return fallback;
  }
  return context[key] !== undefined ? context[key] : fallback;
}

export function DebugProvider({
  children,
  value,
}: {
  children: ReactNode;
  value?: Record<string, any>;
}) {
  return (
    <DebugContext.Provider value={value || {}}>
      {children}
    </DebugContext.Provider>
  );
}
