import { cn } from "../utils/classNames";
import { resolveProps, useCoreUI } from "./configuration";
import type { ButtonProps } from "./types";

/** Built-in view for project replacements that want to retain core behavior. */
export function ButtonBase({
  children,
  tone = "primary",
  appearance = "solid",
  size = "md",
  loading = false,
  loadingLabel = "در حال پردازش...",
  startIcon,
  badge,
  className,
  classNames,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"] || undefined}
      data-core-component="Button"
      data-slot="root"
      data-tone={tone}
      data-appearance={appearance}
      data-size={size}
      data-state={loading ? "loading" : disabled ? "disabled" : "idle"}
      className={cn("core-button", classNames?.root, className)}
    >
      {loading ? (
        <span
          aria-hidden="true"
          data-slot="spinner"
          className={cn("core-spinner", classNames?.spinner)}
        />
      ) : (
        startIcon && (
          <span
            aria-hidden="true"
            data-slot="icon"
            className={cn("core-button-icon", classNames?.icon)}
          >
            {startIcon}
          </span>
        )
      )}
      <span data-slot="label" className={classNames?.label}>
        {loading ? loadingLabel : children}
      </span>
      {!loading && badge != null && (
        <span
          data-slot="badge"
          className={cn("core-button-badge", classNames?.badge)}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function Button(props: ButtonProps) {
  const ui = useCoreUI();
  const View = ui.registry.Button ?? ButtonBase;
  return <View {...resolveProps(ui.components.Button, props)} />;
}
