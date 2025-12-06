import React from "react";
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar, CalendarX, CircleX } from "lucide-react";
import DateObject from "react-date-object";

interface CustomDatePickerProps {
  value: Value;
  onChange: (value: Value) => void;
  placeholder: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <DatePicker
      containerClassName="w-full"
      editable={false} // 👈 Changed to false
      value={value}
      onChange={onChange}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      placeholder={placeholder}
      render={(stringifiedValue, openCalendar) => (
        <div className="relative w-full" onClick={openCalendar}>
          <input
            readOnly // 👈 Important: must be read-only
            value={stringifiedValue || ""}
            placeholder={placeholder}
            className="w-full p-2 pr-10 border border-[var(--input-border)] placeholder:text-[var(--placeholder-text)] rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Calendar size={20} />
          </div>
          {stringifiedValue && (
            <button
              type="button"
              className="absolute top-1/2 left-1 !px-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              tabIndex={-1}
            >
              <CircleX size={18} />
            </button>
          )}
        </div>
      )}
    />
  );
};

export default CustomDatePicker;
