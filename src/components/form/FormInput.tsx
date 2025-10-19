import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
// Assuming these are defined elsewhere or simplified for this file

import { CircleX, Pencil } from "lucide-react";
import ErrorFormText from "./ErrorFormText";
import Label from "./Label";

// The expanded set of field types supported by this component
export type FormInputType =
  | "text"
  | "email"
  | "password"
  | "number" // Integer or general number type
  | "float" // Custom type for explicit floating-point numbers
  | "date"
  | "datetime-local";

// Simplified Clear Button component
const ClearButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="absolute top-1/2 left-2 !px-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
      onClick={onClick}
    >
      <CircleX size={18} />
    </button>
  );
};

interface BaseFormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  multiline?: boolean;
  standalone?: boolean;
}

// Combine input and textarea attributes, and specifically allow our expanded type
type FormInputProps = BaseFormInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
    type?: FormInputType;
  };

const boxIcon = (
  <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 z-10">
    <Pencil size={20} className="bg-white rounded-lg" />
  </div>
);

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
  const isNumeric = type === "number" || type === "float";

  // Use HTML type="number" for both, but control decimal input via 'step'
  const htmlInputType = isNumeric ? "number" : type;
  // Allow decimals for 'float', otherwise use passed step or browser default
  const stepAttr = type === "float" ? "any" : rest.step;

  // Tailwind classes to hide the numeric spin buttons across major browsers
  const numericHiddenArrows = isNumeric
    ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    : "";

  const CLASS_LIST_STYLES =
    "w-full pl-6 pr-10 py-2 border border-[var(--input-border)] text-[var(--primary-text)] rounded-lg text-right placeholder:text-[var(--placeholder-text)] placeholder:font-thin focus:outline-none focus:ring-2 focus:ring-purple-500";

  // --- 1. Standalone Mode (No React Hook Form) ---
  if (standalone) {
    const [value, setValue] = React.useState("");

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const rawValue = e.target.value;
      setValue(rawValue);

      if (onValueChange) {
        onValueChange(rawValue);
      }
    };

    const handleClear = () => {
      setValue("");
      if (onValueChange) onValueChange("");
    };

    const commonProps = {
      id: name,
      placeholder,
      value,
      onChange: handleChange,
      className: `${CLASS_LIST_STYLES} ${className} ${numericHiddenArrows}`,
      ...rest,
    };

    if (multiline) {
      return (
        <div className="w-full">
          <Label>{label}</Label>
          <div className="relative w-full">
            <textarea
              {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              rows={rest.rows || 3}
            />
            {boxIcon}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <Label>{label}</Label>
        <div className="relative w-full">
          <input
            {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
            type={htmlInputType}
            step={stepAttr}
          />
          {boxIcon}
          {value && <ClearButton onClick={handleClear} />}
        </div>
      </div>
    );
  }

  // --- 2. RHF Mode (With React Hook Form) ---
  const formContext = useFormContext();

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
    control,
  } = formContext;

  const currentValue = useWatch({ name, control });

  const { onChange: registerOnChange, ...registerRest } = register(name);

  // Custom Change Handler for both text and number types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rawValue = e.target.value;

    if (isNumeric) {
      // --- Special Handling for Numbers and Floats ---
      let newValue: number | null = null;

      if (rawValue !== "") {
        const parsed = parseFloat(rawValue);

        if (isFinite(parsed)) {
          if (type === "number") {
            // If the type is explicitly 'number' (integer), truncate the float part
            newValue = Math.trunc(parsed);
          } else {
            // If the type is 'float', keep the decimal value
            newValue = parsed;
          }
        }
      }

      // Use setValue directly to update RHF state with the correct type (number or null)
      setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
    } else {
      // --- Standard Handling for Text/Date/etc. (string value) ---
      registerOnChange(e as any);
    }

    if (onValueChange) {
      onValueChange(rawValue);
    }
  };

  const handleClear = () => {
    // Clear to null for numeric fields to work with optional Zod numbers.
    // Clear to empty string for text fields.
    const clearValue = isNumeric ? null : "";

    setValue(name, clearValue, { shouldValidate: true, shouldDirty: true });
    if (onValueChange) {
      onValueChange("");
    }
  };

  const commonProps = {
    id: name,
    placeholder,
    // Add classes to hide arrows here
    className: `${CLASS_LIST_STYLES} ${className} ${numericHiddenArrows}`,
    ...registerRest,
    onChange: handleChange,
    ...rest,
  };

  const inputDisplayValue = isNumeric
    ? currentValue === null || currentValue === undefined
      ? ""
      : String(currentValue)
    : currentValue;

  if (multiline) {
    return (
      <div className="w-full">
        <Label>{label}</Label>
        <div className="relative w-full">
          <textarea
            {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rest.rows || 3}
          />
          {boxIcon}
        </div>
        {errors[name] && (
          <ErrorFormText msg={errors[name]?.message as string} />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Label>{label}</Label>
      <div className="relative w-full">
        <input
          {...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
          type={htmlInputType}
          step={stepAttr} // Applies step="any" for 'float' type
          value={inputDisplayValue}
        />
        {boxIcon}
        {currentValue !== undefined &&
          currentValue !== null &&
          currentValue !== "" && <ClearButton onClick={handleClear} />}
      </div>
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};
