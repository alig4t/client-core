import type {
  ComponentPropsWithRef,
  ComponentType,
  CSSProperties,
  ReactNode,
} from "react";

export type Direction = "rtl" | "ltr";
export type ControlSize = "sm" | "md" | "lg";
export type Tone = "primary" | "neutral" | "success" | "danger";
export type Appearance = "solid" | "outline" | "ghost" | "link";
export type SlotClasses<S extends string> = Partial<Record<S, string>>;
export type ThemeTokens = { [key: `--core-${string}`]: string | number };

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  tone?: Tone;
  appearance?: Appearance;
  size?: ControlSize;
  loading?: boolean;
  loadingLabel?: ReactNode;
  startIcon?: ReactNode;
  badge?: ReactNode;
  classNames?: SlotClasses<"root" | "icon" | "label" | "badge" | "spinner">;
}
export interface InputProps extends ComponentPropsWithRef<"input"> {
  controlSize?: ControlSize;
  classNames?: SlotClasses<"root">;
}
export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
}
export interface FieldProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {
  label: ReactNode;
  controlId?: string;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: (control: FieldControlProps) => ReactNode;
  classNames?: SlotClasses<
    "root" | "label" | "description" | "error" | "control"
  >;
}
export interface DialogProps
  extends Omit<ComponentPropsWithRef<"div">, "title"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  closeLabel?: string;
  mobileBottomSheet?: boolean;
  portalContainer?: HTMLElement;
  classNames?: SlotClasses<
    | "root"
    | "overlay"
    | "header"
    | "title"
    | "description"
    | "close"
    | "content"
  >;
}
export interface TableProps extends ComponentPropsWithRef<"table"> {
  header?: ReactNode;
  caption?: ReactNode;
  empty?: boolean;
  emptyContent?: ReactNode;
  columnCount?: number;
  density?: "compact" | "comfortable";
  classNames?: SlotClasses<
    "root" | "viewport" | "caption" | "header" | "body" | "empty"
  >;
}

export interface UIComponentProps {
  Button: ButtonProps;
  Input: InputProps;
  Field: FieldProps;
  Dialog: DialogProps;
  Table: TableProps;
  Skeleton: SkeletonProps;
}
export interface SkeletonProps extends ComponentPropsWithRef<"div"> {
  shape?: "text" | "rect" | "circle";
  animate?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  classNames?: SlotClasses<"root">;
}
export type ComponentSettings<
  P extends { classNames?: Record<string, string | undefined> },
> = {
  defaultProps?: Partial<
    Omit<P, "children" | "ref" | "className" | "classNames" | "style">
  >;
  className?: string;
  classNames?: P["classNames"];
};
export type UIComponents = {
  [K in keyof UIComponentProps]?: ComponentSettings<UIComponentProps[K]>;
};
export type UIRegistry = {
  [K in keyof UIComponentProps]?: ComponentType<UIComponentProps[K]>;
};
export interface UIConfiguration {
  direction?: Direction;
  locale?: string;
  components?: UIComponents;
  registry?: UIRegistry;
}
export interface ThemeScopeProps extends ComponentPropsWithRef<"div"> {
  tokens?: ThemeTokens;
  mode?: "light" | "dark";
  dir?: Direction;
  style?: CSSProperties;
}
