// src/components/form/DateInput.tsx
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { DateObject, type Value } from "react-multi-date-picker"; // Value = DateObject | null
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import ErrorFormText from "./ErrorFormText";
import Label from "./Label";
import DateUtil from "@/core/forms/DateUtils";

interface DateInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (isoValue: string) => void;
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
  // --- Standalone Mode ---
  if (standalone) {
    const [dateObjectValue, setDateObjectValue] = React.useState<Value>(null);

    const handleChange = (newValue: Value) => {
      setDateObjectValue(newValue);
      if (newValue instanceof DateObject) {
        // تبدیل DateObject شمسی به تاریخ میلادی سپس به ISO
        const gregorianDate = newValue.convert(gregorian).toDate();
        const isoString = gregorianDate.toISOString().replace("Z", "+00:00");
        onValueChange?.(isoString);
      } else {
        onValueChange?.("");
      }
    };

    return (
      <div className={`w-full ${className}`}>
        <Label>{label}</Label>
        <div className="w-full">
          <CustomDatePicker
            value={dateObjectValue}
            onChange={handleChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  // --- RHF Mode ---
  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "DateInput must be used inside a FormWrapper (FormProvider). Use standalone={true} for standalone usage."
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
        render={({ field: { onChange, value: isoValueFromRHF } }) => {
          // تبدیل ISO دریافتی از RHF به DateObject شمسی برای نمایش
          let dateObjectForPicker: Value = null;
          if (isoValueFromRHF) {
            try {
              const jsDate = new Date(isoValueFromRHF);
              if (!isNaN(jsDate.getTime())) {
                dateObjectForPicker = new DateObject(jsDate).convert(persian);
              }
            } catch (e) {
              // در صورت خطا، null باقی می‌ماند
            }
          }

          return (
            <CustomDatePicker
              value={dateObjectForPicker}
              onChange={(selectedValue: Value) => {
                if (selectedValue instanceof DateObject) {
                  // تبدیل DateObject شمسی به ISO
                  const gregorianDate = selectedValue
                    .convert(gregorian)
                    .toDate();
                  const isoToSend = gregorianDate
                    .toISOString()
                    .replace("Z", "+00:00");
                  onChange(isoToSend);
                  onValueChange?.(isoToSend);
                } else {
                  // کاربر مقدار را پاک کرده
                  onChange("");
                  onValueChange?.("");
                }
              }}
              placeholder={placeholder}
            />
          );
        }}
      />
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
