import { useId, useState, type InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";
interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "onChange"> {
  name: string;
  label?: string;
  standalone?: boolean;
  hideLabel?: boolean;
  onChange?: (checked: boolean) => void;
}
function CheckboxControl({
  name,
  label,
  hideLabel,
  checked,
  onChange,
  className,
  id,
  defaultChecked: _defaultChecked,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const controlId = id ?? `checkbox-${generatedId}`;
  return (
    <label
      htmlFor={controlId}
      className={"flex items-center gap-2 " + (className ?? "")}
    >
      <input
        {...rest}
        id={controlId}
        name={name}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 accent-purple-600"
      />
      {!hideLabel && label}
    </label>
  );
}
function StandaloneCheckbox({
  standalone: _standalone,
  ...props
}: CheckboxProps) {
  const [checked, setChecked] = useState(Boolean(props.defaultChecked));
  return (
    <CheckboxControl
      {...props}
      checked={props.checked ?? checked}
      onChange={(next) => {
        setChecked(next);
        props.onChange?.(next);
      }}
    />
  );
}
function ConnectedCheckbox({
  standalone: _standalone,
  ...props
}: CheckboxProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <CheckboxControl
            {...props}
            checked={field.value}
            onChange={(value) => {
              field.onChange(value);
              props.onChange?.(value);
            }}
          />
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
export function Checkbox(props: CheckboxProps) {
  return props.standalone ? (
    <StandaloneCheckbox {...props} />
  ) : (
    <ConnectedCheckbox {...props} />
  );
}
