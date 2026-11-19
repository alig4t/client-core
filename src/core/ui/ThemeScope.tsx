import { useState } from "react";
import { UIContext, useCoreUI } from "./configuration";
import { cn } from "../utils/classNames";
import type { ThemeScopeProps } from "./types";

export function ThemeScope({
  children,
  tokens,
  mode,
  dir,
  lang,
  className,
  style,
  ...props
}: ThemeScopeProps) {
  const parent = useCoreUI();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const direction = dir ?? parent.direction;
  const locale = lang ?? parent.locale;
  return (
    <UIContext.Provider
      value={{ ...parent, direction, locale, portalContainer }}
    >
      <div
        {...props}
        data-core-scope=""
        data-core-theme={mode}
        dir={direction}
        lang={locale}
        className={cn("core-scope", className)}
        style={{ ...tokens, ...style }}
      >
        {children}
        <div data-core-portal="" ref={setPortalContainer} />
      </div>
    </UIContext.Provider>
  );
}
