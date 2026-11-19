import { cn } from "../utils/classNames";
import { resolveProps, useCoreUI } from "./configuration";
import type { SkeletonProps } from "./types";

export function SkeletonBase({
  shape = "text",
  animate = true,
  width,
  height,
  className,
  classNames,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden={props["aria-hidden"] ?? true}
      data-core-component="Skeleton"
      data-slot="root"
      data-shape={shape}
      data-animate={animate || undefined}
      className={cn("core-skeleton", classNames?.root, className)}
      style={{ width, height, ...style }}
    />
  );
}
export function Skeleton(props: SkeletonProps) {
  const ui = useCoreUI();
  const View = ui.registry.Skeleton ?? SkeletonBase;
  return <View {...resolveProps(ui.components.Skeleton, props)} />;
}
