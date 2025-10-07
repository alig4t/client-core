import React from 'react';

interface CheckboxProps {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;