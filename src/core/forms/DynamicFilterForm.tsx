import CustomDatePicker from "@/core/components/form/CustomDatePicker";
import Input from "@/core/components/form/Input";
import { Select } from "@/core/components/form/Select";
import React, { useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import { DateObject } from "react-multi-date-picker";
import type { FilterField } from "./Filter"; // Import field type
import { useCore } from "../entity/CoreProvider";

export interface DynamicFilters {
  [key: string]: unknown;
}

interface DynamicFilterFormProps {
  fields: FilterField[]; // Array of field configurations
  onApplyFilters: (filters: DynamicFilters) => void;
}

const DynamicFilterForm: React.FC<DynamicFilterFormProps> = ({
  fields,
  onApplyFilters,
}) => {
  const { direction } = useCore();
  // A state to hold values of all fields
  const [formState, setFormState] = useState<
    Record<string, string | number | DateObject | null>
  >({});

  // A function to manage changes of all inputs
  const handleInputChange = (
    fieldName: string,
    value: string | number | DateObject | null,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleApply = () => {
    const finalFilters: DynamicFilters = {};

    // Convert form state to API required format
    for (const field of fields) {
      const value = formState[field.name];
      if (value !== null && value !== undefined && value !== "") {
        // If date, format it
        if (value instanceof DateObject) {
          finalFilters[field.filterKey] = new DateObject(value)
            .convert(gregorian)
            .format("YYYY-MM-DD");
        } else {
          finalFilters[field.filterKey] = value;
        }
      }
    }
    onApplyFilters(finalFilters);
  };

  const handleClear = () => {
    setFormState({});
    onApplyFilters({});
  };

  return (
    <div dir={direction}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dynamic render of fields based on config */}
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === "text" && (
              <Input
                placeholder={`جستجو بر اساس ${field.label}...`}
                value={String(formState[field.name] ?? "")}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            )}
            {field.type === "date" && (
              <CustomDatePicker
                value={
                  formState[field.name] instanceof DateObject
                    ? formState[field.name]
                    : null
                }
                onChange={(date) =>
                  handleInputChange(
                    field.name,
                    date instanceof DateObject ? date : null,
                  )
                }
                placeholder="انتخاب تاریخ"
              />
            )}
            {field.type === "select" && (
              <Select
                value={String(formState[field.name] ?? "")}
                onChange={(value) => handleInputChange(field.name, value)}
                options={field.options || []}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleApply}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          اعمال فیلتر
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200"
        >
          حذف فیلتر
        </button>
      </div>
    </div>
  );
};

export default DynamicFilterForm;
