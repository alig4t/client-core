import { Controller, useFormContext } from "react-hook-form";
import type { SelectOption } from "../../forms/FieldFormTypes";
interface FormSelectProps {
  name: string;
  label?: string;
  minilabel?: string;
  options: SelectOption[];
  multi?: boolean;
  className?: string;
  placeholder?: string;
  maxVisible?: number;
  disabled?: boolean;
}
export function FormSelect({
  name,
  label,
  minilabel,
  options,
  multi = false,
  className,
  placeholder = "انتخاب کنید",
  disabled,
}: FormSelectProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={className}>
          <label htmlFor={name} className="block mb-1.5 text-sm">
            {label ?? minilabel}
          </label>
          <select
            id={name}
            name={name}
            multiple={multi}
            disabled={disabled}
            className="w-full p-2 rounded-lg border bg-[var(--input-bg)] border-[var(--input-border)]"
            value={
              multi
                ? Array.isArray(field.value)
                  ? field.value.map(String)
                  : []
                : field.value == null
                  ? ""
                  : String(field.value)
            }
            onBlur={field.onBlur}
            onChange={(event) => {
              const resolve = (value: string) =>
                options.find((option) => String(option.value) === value)?.value;
              field.onChange(
                multi
                  ? Array.from(event.target.selectedOptions).map((option) =>
                      resolve(option.value),
                    )
                  : (resolve(event.target.value) ?? null),
              );
            }}
            aria-invalid={Boolean(fieldState.error)}
          >
            {!multi && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldState.error && (
            <p role="alert" className="text-red-600">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
