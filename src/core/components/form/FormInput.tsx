import { useState, type InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";
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
interface FormInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "onChange" | "type"
> {
  name: string;
  label: string;
  type?: FormInputType;
  onValueChange?: (value: string) => void;
  multiline?: boolean;
  standalone?: boolean;
  rows?: number;
}
const styles =
  "w-full p-2 border rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--input-border)]";
function Control({
  name,
  label,
  type = "text",
  multiline,
  rows = 3,
  onValueChange,
  error,
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
    <div className={props.className ?? "w-full"}>
      <label htmlFor={name} className="block text-sm mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          rows={rows}
          maxLength={props.maxLength}
          disabled={props.disabled}
          placeholder={props.placeholder}
          onChange={(event) => change(event.target.value)}
          className={styles}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? name + "-error" : undefined}
        />
      ) : (
        <input
          {...props}
          id={name}
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
          className={styles}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? name + "-error" : undefined}
        />
      )}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
        >
          {showPassword ? "مخفی کردن" : "نمایش"}
        </button>
      )}
      {error && (
        <p id={name + "-error"} role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}
    </div>
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
          onBlur={field.onBlur}
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
