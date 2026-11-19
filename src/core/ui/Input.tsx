import { cn } from "../utils/classNames";
import { resolveProps, useCoreUI } from "./configuration";
import type { InputProps } from "./types";

export function InputBase({
  className,
  classNames,
  controlSize = "md",
  type = "text",
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      type={type}
      data-core-component="Input"
      data-slot="root"
      data-size={controlSize}
      className={cn("core-input", classNames?.root, className)}
    />
  );
}
export function Input(props: InputProps) {
  const ui = useCoreUI();
  const View = ui.registry.Input ?? InputBase;
  return <View {...resolveProps(ui.components.Input, props)} />;
}
