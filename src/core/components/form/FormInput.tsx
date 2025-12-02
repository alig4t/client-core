// FormInput.tsx
import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Binary, CircleX, Eye, EyeOff, Pencil } from "lucide-react";
import ErrorFormText from "./ErrorFormText";
import Label from "./Label";

export type FormInputType =
  | "text"
  | "email"
  | "password"
  | "number" // For int
  | "long" // For long
  | "float" // For float
  | "double" // For double
  | "bigDecimal" // For BigDecimal
  | "date"
  | "datetime-local";

interface BaseFormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
  multiline?: boolean;
  standalone?: boolean;
  maxLength?: number; // For strings
}

type FormInputProps = BaseFormInputProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> & {
    type?: FormInputType;
  };

const ClearButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    className="absolute top-1/2 left-2 !px-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
    onClick={onClick}
    aria-label="پاک کردن"
  >
    <CircleX size={18} />
  </button>
);

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  onValueChange,
  multiline = false,
  standalone = false,
  className = "",
  maxLength: customMaxLength,
  ...rest
}) => {
  // Determine maxLength based on type
  const getDefaultMaxLength = () => {
    switch (type) {
      case "number":
        return 11; // int: -2147483648 (11 chars)
      case "long":
        return 20; // long: -9223372036854775808 (20 chars)
      case "float":
        return 15; // float: e.g., -1.2345678e+38 (15 logical)
      case "double":
        return 25; // double: up to ~17 significant digits + symbol
      case "bigDecimal":
        return 50; // Configurable, but default 50
      case "text":
      case "email":
      case "password":
        return customMaxLength ?? 255;
      default:
        return undefined;
    }
  };

  const maxLength = getDefaultMaxLength();

  // For password toggle
  const [showPassword, setShowPassword] = useState(false);

  // Eye icon for password
  const passwordToggleIcon = type === "password" && (
    <button
      type="button"
      className="absolute !p-0 top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  // Pencil icon for non-password
  const pencilIcon = type !== "password" && (
    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 z-10">
      {type === "number" ||
        type === "long" ||
        type === "float" ||
        type === "double" ||
        type === "bigDecimal" ? (
        <Binary size={20} className="bg-transparent rounded-lg" />
      ) : (
        <Pencil size={20} className="bg-transparent rounded-lg" />
      )}
    </div>
  );

  const CLASS_LIST_STYLES =
    "w-full pl-7 pr-10 py-2 border border-[var(--input-border)] text-[var(--primary-text)] rounded-lg text-right placeholder:text-[var(--placeholder-text)] placeholder:font-thin focus:outline-none focus:ring-2 focus:ring-purple-500";

  // --- Standalone Mode ---
  if (standalone) {
    const [value, setValue] = useState("");

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      let rawValue = e.target.value;

      // Validate allowed characters based on type
      if (["number", "long", "float", "double", "bigDecimal"].includes(type)) {
        const regex =
          type === "number" || type === "long"
            ? /^-?\d*$/ // Only integer (positive/negative)
            : /^-?\d*\.?\d*$/; // Decimal

        if (rawValue !== "" && !regex.test(rawValue)) {
          return; // Invalid input — ignored
        }
      }

      setValue(rawValue);
      onValueChange?.(rawValue);
    };

    const handleClear = () => {
      setValue("");
      onValueChange?.("");
    };

    const commonProps = {
      id: name,
      placeholder,
      value,
      onChange: handleChange,
      className: `${CLASS_LIST_STYLES} ${className}`,
      maxLength,
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
            {pencilIcon}
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
            type={
              type === "password"
                ? showPassword
                  ? "text"
                  : "password"
                : "text"
            }
          />
          {passwordToggleIcon}
          {pencilIcon}
          {value && <ClearButton onClick={handleClear} />}
        </div>
      </div>
    );
  }

  // --- RHF Mode ---
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error(
      "FormInput must be used inside a FormWrapper (FormProvider). Use standalone={true} for standalone usage."
    );
  }

  const {
    register,
    formState: { errors },
    control,
  } = formContext;

  const currentValue = useWatch({ name, control }) ?? "";
  const { onChange: registerOnChange, ...registerRest } = register(name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let rawValue = e.target.value;

    // Restrict allowed characters based on type
    if (["number", "long", "float", "double", "bigDecimal"].includes(type)) {
      const isIntegerType = type === "number" || type === "long";
      const regex = isIntegerType ? /^-?\d*$/ : /^-?\d*\.?\d*$/;

      if (rawValue !== "" && !regex.test(rawValue)) {
        return; // Invalid input — no change applied
      }

      // Prevent multiple dots (e.g., 12..34)
      if (!isIntegerType && (rawValue.match(/\./g) || []).length > 1) {
        return;
      }
    }

    registerOnChange(e);
    onValueChange?.(rawValue);
  };

  const handleClear = () => {
    registerOnChange({ target: { name, value: "" } });
    onValueChange?.("");
  };

  const commonProps = {
    id: name,
    placeholder,
    className: `${CLASS_LIST_STYLES} ${className}`,
    maxLength,
    ...registerRest,
    onChange: handleChange,
    ...rest,
  };

  if (multiline) {
    return (
      <div className="w-full">
        <Label>{label}</Label>
        <div className="relative w-full">
          <textarea
            {...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            value={currentValue as string}
            rows={rest.rows || 3}
          />
          {pencilIcon}
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
          type={
            type === "password" ? (showPassword ? "text" : "password") : "text"
          }
          value={currentValue as string}
        />
        {passwordToggleIcon}
        {pencilIcon}
        {currentValue !== "" && <ClearButton onClick={handleClear} />}
      </div>
      {errors[name] && <ErrorFormText msg={errors[name]?.message as string} />}
    </div>
  );
};

export default FormInput;
