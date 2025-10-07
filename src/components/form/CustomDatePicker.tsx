import React from 'react';
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar } from 'lucide-react';

// Define the types for the component's props
interface CustomDatePickerProps {
  value: Value;
  onChange: (value: Value) => void;
  placeholder: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, placeholder }) => {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      // FIX: Use direct arguments instead of destructuring an object
      render={(stringifiedValue, openCalendar) => (
        <div 
          className="relative w-full" 
          // Use the openCalendar function on the wrapper div
          onClick={openCalendar}
        >
          <input
            readOnly
            // The first argument is the string value to display
            value={stringifiedValue}
            placeholder={placeholder}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Calendar size={20} />
          </div>
        </div>
      )}
    />
  );
};

export default CustomDatePicker;