import React from 'react';

// تعریف نوع برای هر گزینه
interface Option {
  value: string | number;
  label: string;
}

// تعریف نوع برای پراپ‌های کامپوننت
interface SelectProps {
  options: Option[];
}

const Select: React.FC<SelectProps> = ({ options }) => {
  return (
    <select
        dir="rtl"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-no-repeat"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'left 0.5rem center',
            backgroundSize: '1.5em 1.5em',
            paddingLeft: '2.5rem'
        }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default Select;