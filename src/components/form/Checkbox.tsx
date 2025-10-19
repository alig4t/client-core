// src/components/form/Checkbox.tsx

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Label from "./Label";
import ErrorFormText from "./ErrorFormText";

interface BaseCheckboxProps {
  name: string;
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  // حالت ساده (بدون react-hook-form)
  standalone?: boolean;
  // برای جدول: فقط چک‌باکس خام
  hideLabel?: boolean;
}

type CheckboxProps = BaseCheckboxProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  className = "",
  onChange,
  disabled = false,
  standalone = false,
  hideLabel = false,
  ...rest
}) => {
  // --- حالت ساده (بدون React Hook Form) ---
  if (standalone) {
    const [checked, setChecked] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setChecked(newChecked);
      if (onChange) onChange(newChecked);
    };

    return (
      <div className={`flex items-center ${className}`}>
        {!hideLabel && label && (
          <label htmlFor={name} className="mr-2 text-sm text-gray-700">
            {label}
          </label>
        )}
        <label className="relative flex items-center cursor-pointer">
          <input
            id={name}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...rest}
          />
          <div
            className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors duration-200 ${
              checked
                ? "bg-purple-600 border-purple-600"
                : "border-gray-300 hover:border-purple-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {checked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </label>
      </div>
    );
  }

  // --- حالت عادی (با React Hook Form) ---
  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "Checkbox must be used inside a FormProvider. If you want to use it standalone, pass standalone={true}."
    );
  }

  const {
    register,
    formState: { errors },
  } = formContext;

  const { onChange: registerOnChange, ...registerRest } = register(name);
  const currentValue = useWatch({ name, control: formContext.control });

  const checkboxRef = React.useRef<HTMLInputElement>(null); // 👈 اضافه شد

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerOnChange(e);
    if (onChange) onChange(e.target.checked);
  };

  const handleDivClick = () => {
    if (checkboxRef.current && !disabled) {
      checkboxRef.current.click(); // شبیه‌سازی کلیک روی چک‌باکس
    }
  };

  // --- رندر UI ---
  const renderCheckbox = () => (
    <label className="relative flex items-center cursor-pointer min-h-10 ">
      <input
        id={name}
        type="checkbox"
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...registerRest}
        {...rest}
      />
      <div
        className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors duration-200 ${
          currentValue
            ? "bg-purple-600 border-purple-600"
            : "border-gray-300 hover:border-purple-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {currentValue && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </label>
  );

  // --- حالت جدول (بدون لیبل و خطا) ---
  if (hideLabel) {
    return renderCheckbox();
  }

  // --- حالت فرم (با لیبل و خطا) ---
  return (
    <div className="">
      <Label> </Label>
      <div
        className={`flex items-center
          rounded-md px-2 ${className}`}
      >
        {/* border border-gray-300 */}
        {renderCheckbox()}
        {label && (
          <label htmlFor={name} className="mr-2 text-sm text-gray-700">
            {label}
          </label>
        )}
        {errors[name] && (
          <ErrorFormText msg={errors[name]?.message as string} />
        )}
      </div>
    </div>
  );
};

// import React from 'react';

// interface CheckboxProps {
//   label: string;
// }

// const Checkbox: React.FC<CheckboxProps> = ({ label }) => {
//   return (
//     <label className="flex items-center gap-2 cursor-pointer">
//       <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
//       <span>{label}</span>
//     </label>
//   );
// };

// export default Checkbox;
