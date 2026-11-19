import { createContext, useContext } from "react";
import { cn } from "../utils/classNames";
import type {
  ComponentSettings,
  Direction,
  UIComponents,
  UIConfiguration,
  UIRegistry,
} from "./types";

export interface UIContextValue {
  direction: Direction;
  locale: string;
  components: UIComponents;
  registry: UIRegistry;
  // undefined uses the application's modal-root/body; null waits for a scope host.
  portalContainer?: HTMLElement | null;
}
export const UIContext = createContext<UIContextValue>({
  direction: "rtl",
  locale: "fa-IR",
  components: {
    Skeleton: { defaultProps: { shape: "text", animate: true } },
    Button: {
      defaultProps: {
        tone: "primary",
        appearance: "solid",
        size: "md",
        loading: false,
        type: "button",
        loadingLabel: "در حال پردازش...",
      },
    },
    Input: { defaultProps: { type: "text", controlSize: "md" } },
    Dialog: {
      defaultProps: { closeLabel: "بستن مودال", mobileBottomSheet: false },
    },
    Table: {
      defaultProps: {
        density: "comfortable",
        emptyContent: "داده‌ای یافت نشد.",
        columnCount: 1,
      },
    },
  },
  registry: {},
});
export const useCoreUI = () => useContext(UIContext);

function definedProps(props?: object) {
  return Object.fromEntries(
    Object.entries(props ?? {}).filter(([, value]) => value !== undefined),
  );
}

export function mergeSlots(
  ...sources: (Record<string, string | undefined> | undefined)[]
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const source of sources)
    for (const [slot, classes] of Object.entries(source ?? {}))
      result[slot] = cn(result[slot], classes);
  return result;
}

export function mergeUI(
  parent: UIContextValue,
  value: UIConfiguration,
): UIContextValue {
  const components = { ...parent.components };
  for (const name of Object.keys(
    value.components ?? {},
  ) as (keyof UIComponents)[]) {
    const previous = parent.components[name];
    const next = value.components?.[name];
    // The keys are correlated by name; each public configuration remains typed.
    Object.assign(components, {
      [name]: {
        defaultProps: {
          ...previous?.defaultProps,
          ...definedProps(next?.defaultProps),
        },
        className: cn(
          previous?.classNames?.root,
          previous?.className,
          next?.classNames?.root,
          next?.className,
        ),
        classNames: mergeSlots(previous?.classNames, next?.classNames),
      },
    });
  }
  return {
    ...parent,
    direction: value.direction ?? parent.direction,
    locale: value.locale ?? parent.locale,
    components,
    registry: { ...parent.registry, ...definedProps(value.registry) },
  };
}

export function resolveProps<
  P extends {
    className?: string;
    classNames?: Record<string, string | undefined>;
  },
>(settings: ComponentSettings<P> | undefined, props: P): P {
  // An omitted/undefined instance prop retains the configured project default.
  const defined = definedProps(props);
  return {
    ...settings?.defaultProps,
    ...defined,
    className: cn(
      settings?.classNames?.root,
      settings?.className,
      props.classNames?.root,
      props.className,
    ),
    classNames: mergeSlots(settings?.classNames, props.classNames),
  } as P;
}
