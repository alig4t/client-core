import { useId } from "react";
import { cn } from "../utils/classNames";
import { resolveProps, useCoreUI } from "./configuration";
import type { FieldProps } from "./types";

export function FieldBase({
  label,
  controlId,
  description,
  error,
  required,
  children,
  className,
  classNames,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const id = controlId ?? `core-field-${generatedId}`;
  const describedBy =
    [
      description ? `${id}-description` : undefined,
      error ? `${id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div
      {...props}
      data-core-component="Field"
      data-slot="root"
      data-state={error ? "invalid" : "valid"}
      className={cn("core-field", classNames?.root, className)}
    >
      <label
        htmlFor={id}
        data-slot="label"
        className={cn("core-field-label", classNames?.label)}
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div data-slot="control" className={classNames?.control}>
        {children({
          id,
          "aria-describedby": describedBy,
          "aria-invalid": error ? true : undefined,
          required,
        })}
      </div>
      {description && (
        <p
          id={`${id}-description`}
          data-slot="description"
          className={cn("core-field-description", classNames?.description)}
        >
          {description}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          data-slot="error"
          className={cn("core-field-error", classNames?.error)}
        >
          {error}
        </p>
      )}
    </div>
  );
}
export function Field(props: FieldProps) {
  const ui = useCoreUI();
  const View = ui.registry.Field ?? FieldBase;
  return <View {...resolveProps(ui.components.Field, props)} />;
}
