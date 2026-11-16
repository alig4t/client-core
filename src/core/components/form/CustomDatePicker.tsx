import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorianEn from "react-date-object/locales/gregorian_en";
import { useCore } from "../../entity/CoreProvider";
import DatePicker, { type Value } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
interface CustomDatePickerProps {
  name?: string;
  value: Value;
  onChange: (value: Value) => void;
  placeholder: string;
  withTime?: boolean;
  disabled?: boolean;
}
export default function CustomDatePicker({
  name,
  value,
  onChange,
  placeholder,
  withTime = false,
  disabled,
}: CustomDatePickerProps) {
  const runtime = useCore();
  return (
    <div className="flex gap-1">
      <DatePicker
        id={name}
        containerClassName="w-full"
        inputClass="w-full p-2 border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)]"
        value={value}
        onChange={onChange}
        calendar={runtime.calendar === "gregorian" ? gregorian : persian}
        locale={runtime.calendar === "gregorian" ? gregorianEn : persianFa}
        calendarPosition={
          runtime.direction === "rtl" ? "bottom-right" : "bottom-left"
        }
        placeholder={placeholder}
        disabled={disabled}
        format={withTime ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD"}
        plugins={withTime ? [<TimePicker key="time" position="bottom" />] : []}
      />
      {value && !disabled && (
        <button
          type="button"
          aria-label="پاک کردن تاریخ"
          onClick={() => onChange(null)}
        >
          ×
        </button>
      )}
    </div>
  );
}
