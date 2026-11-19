import {
  useState,
  type InputHTMLAttributes,
  type Ref,
  type FocusEventHandler,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field } from "../../ui/Field";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { cn } from "../../utils/classNames";
import type { SlotClasses } from "../../ui/types";
export type FormInputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "long"
  | "float"
  | "double"
  | "bigDecimal"
  | "date"
  | "datetime-local";
export interface FormInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "onChange" | "type" | "onBlur"
  > {
  name: string;
  label: string;
  type?: FormInputType;
  onValueChange?: (value: string) => void;
  multiline?: boolean;
  standalone?: boolean;
  rows?: number;
  description?: string;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
  classNames?: SlotClasses<
    "root" | "input" | "label" | "description" | "error" | "passwordToggle"
  >;
}
function assignRef(
  ref: FormInputProps["ref"],
  element: HTMLInputElement | HTMLTextAreaElement | null,
) {
  if (typeof ref === "function") ref(element);
  else if (ref) ref.current = element;
}
function Control({
  name,
  label,
  type = "text",
  multiline,
  rows = 3,
  onValueChange,
  error,
  className,
  classNames,
  description,
  ref,
  ...props
}: Omit<FormInputProps, "standalone"> & { error?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const numeric = ["number", "long", "float", "double", "bigDecimal"].includes(
    type,
  );
  const change = (value: string) => {
    if (
      numeric &&
      value &&
      !(
        type === "number" || type === "long" ? /^-?\d*$/ : /^-?\d*\.?\d*$/
      ).test(value)
    )
      return;
    onValueChange?.(value);
  };
  const value = props.value == null ? "" : String(props.value);
  return (
    <Field
      label={label}
      controlId={props.id}
      error={error}
      description={description}
      required={props.required}
      className={className}
      classNames={{
        root: classNames?.root,
        label: classNames?.label,
        description: classNames?.description,
        error: classNames?.error,
      }}
    >
      {(control) => (
        <>
          {multiline ? (
            <textarea
              {...control}
              ref={(element) => assignRef(ref, element)}
              name={name}
              value={value}
              rows={rows}
              maxLength={props.maxLength}
              disabled={props.disabled}
              readOnly={props.readOnly}
              autoFocus={props.autoFocus}
              dir={props.dir}
              style={props.style}
              placeholder={props.placeholder}
              onBlur={props.onBlur}
              onChange={(event) => change(event.target.value)}
              className={cn("core-input", classNames?.input)}
              aria-describedby={
                [control["aria-describedby"], props["aria-describedby"]]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            />
          ) : (
            <Input
              {...props}
              {...control}
              ref={(element) => assignRef(ref, element)}
              name={name}
              value={value}
              type={
                numeric
                  ? "text"
                  : type === "password" && showPassword
                    ? "text"
                    : type
              }
              inputMode={
                numeric
                  ? type === "number" || type === "long"
                    ? "numeric"
                    : "decimal"
                  : props.inputMode
              }
              onChange={(event) => change(event.target.value)}
              className={classNames?.input}
              aria-describedby={
                [control["aria-describedby"], props["aria-describedby"]]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            />
          )}
          {type === "password" && (
            <Button
              type="button"
              appearance="ghost"
              size="sm"
              className={classNames?.passwordToggle}
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            >
              {showPassword ? "مخفی کردن" : "نمایش"}
            </Button>
          )}
        </>
      )}
    </Field>
  );
}
function StandaloneInput({
  standalone: _standalone,
  defaultValue,
  ...props
}: FormInputProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <Control
      {...props}
      value={props.value ?? value}
      onValueChange={(next) => {
        setValue(next);
        props.onValueChange?.(next);
      }}
    />
  );
}
function ConnectedInput({
  standalone: _standalone,
  defaultValue: _defaultValue,
  ...props
}: FormInputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <Control
          {...props}
          value={field.value ?? ""}
          ref={(element) => {
            field.ref(element);
            assignRef(props.ref, element);
          }}
          onBlur={(event) => {
            field.onBlur();
            props.onBlur?.(event);
          }}
          onValueChange={(value) => {
            field.onChange(value);
            props.onValueChange?.(value);
          }}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
export default function FormInput(props: FormInputProps) {
  return props.standalone ? (
    <StandaloneInput {...props} />
  ) : (
    <ConnectedInput {...props} />
  );
}
