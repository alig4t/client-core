// src/components/form/DynamicField.tsx
import React, { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldType, SelectOption } from "./FieldTypes";

interface DynamicFieldProps {
  name: string;
  meta: {
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: SelectOption[];
  };
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ name, meta }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  switch (meta.type) {
    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            id={name}
            type="checkbox"
            {...register(name)}
            className="w-4 h-4"
          />
          <label htmlFor={name} className="text-sm text-gray-700">
            {meta.label}
          </label>
          {errors[name] && (
            <span className="text-red-500 text-sm">
              {errors[name]?.message as ReactNode}
            </span>
          )}
        </div>
      );

    case "select":
      return (
        <div>
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {meta.label}
          </label>
          <select
            id={name}
            {...register(name)}
            className="w-full p-2 border rounded"
          >
            <option value="">انتخاب کنید</option>
            {meta.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors[name] && (
            <span className="text-red-500 text-sm">
              {errors[name]?.message as ReactNode}
            </span>
          )}
        </div>
      );

    case "textarea":
      return (
        <div>
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {meta.label}
          </label>
          <textarea
            id={name}
            {...register(name)}
            placeholder={meta.placeholder}
            className="w-full p-2 border rounded"
            rows={3}
          />
          {errors[name] && (
            <span className="text-red-500 text-sm">
              {errors[name]?.message as ReactNode}
            </span>
          )}
        </div>
      );

    default:
      return (
        <div>
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {meta.label}
          </label>
          <input
            id={name}
            type={meta.type === "text" ? "text" : meta.type}
            placeholder={meta.placeholder}
            {...register(name)}
            className="w-full p-2 border rounded"
          />
          {errors[name] && (
            <span className="text-red-500 text-sm">
              {errors[name]?.message as ReactNode}
            </span>
          )}
        </div>
      );
  }
};
