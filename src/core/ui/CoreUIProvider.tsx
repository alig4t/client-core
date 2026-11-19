import type { ReactNode } from "react";
import { mergeUI, UIContext, useCoreUI } from "./configuration";
import type { UIConfiguration } from "./types";

export function CoreUIProvider({
  children,
  value = {},
}: {
  children: ReactNode;
  value?: UIConfiguration;
}) {
  const parent = useCoreUI();
  return (
    <UIContext.Provider value={mergeUI(parent, value)}>
      {children}
    </UIContext.Provider>
  );
}
