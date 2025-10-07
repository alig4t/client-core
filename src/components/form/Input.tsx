import React from 'react';
import { Search } from 'lucide-react';

// ترکیب پراپ‌های سفارشی با پراپ‌های استاندارد input
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder: string;
};

const Input: React.FC<InputProps> = ({ placeholder, ...props }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-2 pl-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
        {...props}
      />
      <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
    </div>
  );
};

export default Input;