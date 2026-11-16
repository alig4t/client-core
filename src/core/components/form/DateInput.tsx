import { useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import { Controller, useFormContext } from "react-hook-form";
import { DateObject, type Value } from "react-multi-date-picker";
import CustomDatePicker from "./CustomDatePicker";
import { useCore } from "../../entity/CoreProvider";
export type DateKind = "date" | "datetime" | "instant";
interface DateInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  standalone?: boolean;
  kind?: DateKind;
  disabled?: boolean;
  value?: string;
}
export function datePickerValue(
  value: string | undefined,
  kind: DateKind,
  calendar: "persian" | "gregorian" = "persian",
): Value {
  const displayCalendar = calendar === "gregorian" ? gregorian : persian;
  if (!value) return null;
  if (kind === "instant") {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? null
      : new DateObject(date).convert(displayCalendar);
  }
  return new DateObject({
    date: value.replace("T", " "),
    format: kind === "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss",
    calendar: gregorian,
  }).convert(displayCalendar);
}
export function serializePickedDate(value: Value, kind: DateKind): string {
  if (!(value instanceof DateObject)) return "";
  const date = new DateObject(value).convert(gregorian);
  if (kind === "date") return date.format("YYYY-MM-DD");
  if (kind === "datetime") return date.format("YYYY-MM-DDTHH:mm:ss");
  return date.toDate().toISOString();
}
function DateControl({
  name,
  label,
  kind = "instant",
  value,
  onValueChange,
  disabled,
  placeholder = "انتخاب تاریخ",
  className,
}: DateInputProps) {
  const { calendar } = useCore();
  return (
    <div className={className}>
      <label htmlFor={name} className="block mb-1.5 text-sm">
        {label}
      </label>
      <CustomDatePicker
        name={name}
        value={datePickerValue(value, kind, calendar)}
        onChange={(next) => onValueChange?.(serializePickedDate(next, kind))}
        placeholder={placeholder}
        withTime={kind !== "date"}
        disabled={disabled}
      />
    </div>
  );
}
function StandaloneDate(props: DateInputProps) {
  const [value, setValue] = useState(props.value ?? "");
  return (
    <DateControl
      {...props}
      value={props.value ?? value}
      onValueChange={(next) => {
        setValue(next);
        props.onValueChange?.(next);
      }}
    />
  );
}
function ConnectedDate(props: DateInputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <DateControl
            {...props}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              props.onValueChange?.(value);
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
export function DateInput(props: DateInputProps) {
  return props.standalone ? (
    <StandaloneDate {...props} />
  ) : (
    <ConnectedDate {...props} />
  );
}
