import type { Option } from "@/core/forms/OptionUtils";
import React from "react";



// تعریف نوع برای پراپ‌های کامپوننت
interface SelectProps {
  options: Option[];
  value: string | number; // اضافه شد
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // اضافه شد
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <select
      dir="rtl"
      value={value} // اضافه شد
      onChange={onChange} // اضافه شد
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: "left 0.5rem center",
        backgroundSize: "1.5em 1.5em",
        paddingLeft: "2.5rem",
      }}
    >
      {/* می‌توانید یک گزینه پیش‌فرض هم اضافه کنید */}
      <option value="" disabled>
        انتخاب کنید...
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
