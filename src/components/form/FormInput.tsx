// src/components/form/FormInput.tsx

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ErrorFormText } from "@/components/form/ErrorFormText";
import Input from "@/components/form/Input"; // فرض: کامپوننت Input ساده شما
import { CircleX, Pencil, Search } from "lucide-react";

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

const boxIcon = (<div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
  <Pencil size={20} className="bg-white rounded-lg" />
</div>)
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
      className: `w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg  text-right focus:outline-none focus:ring-2 focus:ring-purple-500 ${className} ${value && "pl-9"}`,
      ...rest,
    };

    if (multiline) {
      return (
        <div className="w-full">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 text-right mb-2"
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
          className="block text-sm font-medium text-gray-700 text-right mb-2"
        >
          {label}
        </label>
        {/* <input
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
        /> */}
        <div className="relative w-full">
          <input
            className={`w-full p-2 pr-10 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-purple-500 `}
            {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
            placeholder={placeholder}
            type={type}
          />
          {boxIcon}

          {value && (
          <button
            type="button"
            className="absolute top-1/2 left-2 !px-1 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={()=>setValue("")}
          >
            <CircleX size={18} />
          </button>
        )}
          {/* <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div> */}
        
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
    setValue,
  } = formContext;

  const currentValue = useWatch({ name, control: formContext.control });

  const { onChange: registerOnChange, ...registerRest } = register(name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    registerOnChange(e as any);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };
  
  const handleClear = () => {
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    if (onValueChange) {
      onValueChange("");
    }
  };
  

  const commonProps = {
    id: name,
    placeholder,
    className: `w-full pl-6 pr-10 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-purple-500 ${className} ${currentValue && "pl-9"}`,
    ...registerRest,
    onChange: handleChange,
    ...rest,
  };
  

  console.log(registerRest);

  if (multiline) {
    return (
      <div className="w-full">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 text-right mb-2"
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
        className="block text-sm font-medium text-gray-700 text-right mb-2"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
        />
        {/* آیکون Pencil را حذف یا نگه دارید — ولی Clear مهم‌تر است */}
        {/*  */}
        {boxIcon}
        {/* ✅ دکمه Clear */}
        {currentValue && (
          <button
            type="button"
            className="absolute top-1/2 left-2 !px-1 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <CircleX size={18} />
          </button>
        )}
      </div>
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
