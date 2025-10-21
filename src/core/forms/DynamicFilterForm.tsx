import React, { useState } from "react";
import { DateObject } from "react-multi-date-picker";
import type { FilterField } from "./Filter"; // Import field type
import Input from "@/components/form/Input";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { Select } from "@/components/form/Select";

export interface DynamicFilters {
  [key: string]: any; // e.g., { "name_like": "test", "createdAt_ge": "2025-10-07" }
}

interface DynamicFilterFormProps {
  fields: FilterField[]; // Array of field configurations
  onApplyFilters: (filters: DynamicFilters) => void;
}

const DynamicFilterForm: React.FC<DynamicFilterFormProps> = ({
  fields,
  onApplyFilters,
}) => {
  // A state to hold values of all fields
  const [formState, setFormState] = useState<Record<string, any>>({});

  // A function to manage changes of all inputs
  const handleInputChange = (fieldName: string, value: any) => {
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
          finalFilters[field.filterKey] = value.format("YYYY-MM-DD");
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
    <div dir="rtl">
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
                value={formState[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            )}
            {field.type === "date" && (
              <CustomDatePicker
                value={formState[field.name] || null}
                onChange={(date) => handleInputChange(field.name, date)}
                placeholder="انتخاب تاریخ"
              />
            )}
            {field.type === "select" && (
              <Select
                value={formState[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
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
