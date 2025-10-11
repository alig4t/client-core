// src/components/form/FormInput.tsx

import React from "react";
import { useFormContext } from "react-hook-form";
import { ErrorFormText } from "@/components/form/ErrorFormText";
import Input from "@/components/form/Input"; // فرض: کامپوننت Input ساده شما
import { Search } from "lucide-react";

interface BaseFormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  multiline?: boolean;
  // Prop جدید برای حالت ساده
  standalone?: boolean;
}

type FormInputProps = BaseFormInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  onValueChange,
  multiline = false,
  standalone = false,
  className = "",
  ...rest
}) => {
  // --- حالت ساده (بدون React Hook Form) ---
  if (standalone) {
    const [value, setValue] = React.useState("");

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    const commonProps = {
      id: name,
      placeholder,
      value,
      onChange: handleChange,
      className: `w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`,
      ...rest,
    };

    if (multiline) {
      return (
        <div className="w-full">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 text-right mb-1"
          >
            {label}
          </label>
          <textarea
            {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rest.rows || 3}
          />
        </div>
      );
    }

    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 text-right mb-1"
        >
          {label}
        </label>
        {/* <input
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
        /> */}
        <div className="relative w-full">
          <input
            className="w-full p-2 pl-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
            {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
            placeholder={placeholder}
            type={type}
          />
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
        </div>
      </div>
    );
  }

  // --- حالت عادی (با React Hook Form) ---
  const formContext = useFormContext();

  // بررسی اینکه آیا داخل FormProvider هستیم یا نه
  if (!formContext) {
    throw new Error(
      "FormInput must be used inside a FormWrapper (FormProvider). " +
        "If you want to use it standalone, pass standalone={true}."
    );
  }

  const {
    register,
    formState: { errors },
  } = formContext;

  const { onChange: registerOnChange, ...registerRest } = register(name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    registerOnChange(e as any);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const commonProps = {
    id: name,
    placeholder,
    className: `w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`,
    ...registerRest,
    onChange: handleChange,
    ...rest,
  };

  if (multiline) {
    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 text-right mb-1"
        >
          {label}
        </label>
        <textarea
          {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={rest.rows || 3}
        />
        {errors[name] && (
          <ErrorFormText msg={errors[name]?.message as string} />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 text-right mb-1"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          className="w-full !p-2 pl-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
          placeholder={placeholder}
          type={type}
        />
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          <Search size={20} className="bg-white rounded-lg" />
        </div>
      </div>

      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
