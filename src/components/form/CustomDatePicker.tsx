import React from 'react';
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar, CalendarX, CircleX } from 'lucide-react';

interface CustomDatePickerProps {
  value: Value;
  onChange: (value: Value) => void;
  placeholder: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, placeholder }) => {
  return (
    <DatePicker
      editable={true}
      value={value}
      onChange={onChange}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      placeholder={placeholder}
      render={(stringifiedValue, openCalendar) => (
        <div 
          className="relative w-full"
          onClick={openCalendar}
        >
          <input
            value={stringifiedValue || ''}
            placeholder={placeholder}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Calendar size={20} />
          </div>
          {stringifiedValue && (
            <button
              type="button"
              className="absolute top-1/2 left-1 !px-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation(); // جلوگیری از باز شدن کالندار
                onChange(null); // پاک کردن مقدار
              }}
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

// import React from 'react';
// import DatePicker from "react-multi-date-picker";
// import type { Value } from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import { Calendar } from 'lucide-react';
// import InputIcon from 'react-multi-date-picker/components/input_icon';

// // Define the types for the component's props
// interface CustomDatePickerProps {
//   value: Value;
//   onChange: (value: Value) => void;
//   placeholder: string;
// }

// const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, placeholder }) => {
//   return (
//     <DatePicker
//       value={value}
//       onChange={onChange}
//       calendar={persian}
//       locale={persian_fa}
//       calendarPosition="bottom-right"
//       // FIX: Use direct arguments instead of destructuring an object
//       // render={<div className="relative w-full" ><InputIcon  className="w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"/></div>}
//       render={(stringifiedValue, openCalendar) => (
//         <div 
//           className="relative w-full" 
//           // Use the openCalendar function on the wrapper div
//           onClick={openCalendar}
//         >
//           <input
            
//             // The first argument is the string value to display
//             value={stringifiedValue}
//             placeholder={placeholder}
//             className="w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
//           />
//           <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
//             <Calendar size={20} />
//           </div>
//         </div>
//       )}
//     />
//   );
// };

// export default CustomDatePicker;