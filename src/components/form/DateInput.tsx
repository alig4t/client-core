// src/components/form/DateInput.tsx

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import type { Value } from "react-multi-date-picker";
import ErrorFormText from "./ErrorFormText";
import Label from "./Label";

interface DateInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  // برای دریافت مقدار لحظه‌ای
  onValueChange?: (value: Value) => void;
  // برای استفاده خارج از FormWrapper
  standalone?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  placeholder = "انتخاب تاریخ",
  className = "",
  onValueChange,
  standalone = false,
}) => {
  // --- حالت ساده (بدون React Hook Form) ---
  if (standalone) {
    const [value, setValue] = React.useState<Value>(null);

    const handleChange = (newValue: Value) => {
      setValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <div className={`w-full ${className}`}>
        <Label>{label}</Label>
        <div className="w-full ">
          <CustomDatePicker
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  // --- حالت عادی (با React Hook Form) ---
  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "DateInput must be used inside a FormWrapper (FormProvider). " +
        "If you want to use it standalone, pass standalone={true}."
    );
  }

  const {
    control,
    formState: { errors },
  } = formContext;

  return (
    <div className={`w-full ${className}`}>
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <CustomDatePicker
            value={value || null}
            onChange={(newValue) => {
              onChange(newValue);
              if (onValueChange) {
                onValueChange(newValue);
              }
            }}
            placeholder={placeholder}
          />
        )}
      />
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
