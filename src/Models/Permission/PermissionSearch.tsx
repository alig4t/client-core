// src/pages/permission/PermissionSearch.tsx

import React, { useState } from "react";
import { DateObject } from "react-multi-date-picker";
import Input from "@/components/form/Input";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import type { PermissionModel } from "@/Models/Permission/PermissionModel";
import { permissionModelMeta } from "./PermissionModel.meta";

// --- تابع کمکی برای ساخت کلید فیلتر ---
const getFilterKey = (fieldName: string, fieldType: string): string => {
  if (
    fieldType === "text" ||
    fieldType === "email" ||
    fieldType === "textarea"
  ) {
    return `${fieldName}_like`;
  }
  if (fieldName === "createdAt" || fieldName === "updatedAt") {
    // برای تاریخ‌ها، بعداً با پیشوند `ge` یا `le` استفاده می‌شود
    return fieldName; // خود فیلد پایه
  }
  // برای سایر فیلدها (مثل boolean, number)
  return fieldName;
};

// --- نوع خروجی فیلترها ---
export interface PermissionFilters {
  [key: string]: any;
}

interface PermissionSearchProps {
  onApplyFilters: (filters: PermissionFilters) => void;
}

const PermissionSearch: React.FC<PermissionSearchProps> = ({
  onApplyFilters,
}) => {
  // فقط فیلدهایی که می‌خوایم در سرچ باشن
  const searchableFields = ["showName", "name"] as const;
  const dateFields = ["createdAt"] as const; // می‌تونی updatedAt هم اضافه کنی

  const [formState, setFormState] = useState<Record<string, any>>({});

  const handleInputChange = (fieldName: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleApply = () => {
    const filters: PermissionFilters = {};

    // فیلدهای متنی
    searchableFields.forEach((field) => {
      const value = formState[field];
      if (value) {
        filters[`${field}_like`] = value;
      }
    });

    // فیلدهای تاریخ (از تاریخ / تا تاریخ)
    if (formState.fromDate) {
      filters["createdAt_ge"] =
        formState.fromDate instanceof DateObject
          ? formState.fromDate.format("YYYY-MM-DD")
          : formState.fromDate;
    }
    if (formState.toDate) {
      filters["createdAt_le"] =
        formState.toDate instanceof DateObject
          ? formState.toDate.format("YYYY-MM-DD")
          : formState.toDate;
    }

    onApplyFilters(filters);
  };

  const handleClear = () => {
    setFormState({});
    onApplyFilters({});
  };

  return (
    <div dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* فیلدهای متنی */}
        {searchableFields.map((fieldKey) => {
          const meta = permissionModelMeta.fields[fieldKey];
          return (
            <div key={fieldKey}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {meta?.label}
              </label>
              <Input
                placeholder={`جستجو بر اساس ${meta?.label}...`}
                value={formState[fieldKey] || ""}
                onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              />
            </div>
          );
        })}

        {/* فیلدهای تاریخ */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            از تاریخ ایجاد
          </label>
          <CustomDatePicker
            value={formState.fromDate || null}
            onChange={(date) => handleInputChange("fromDate", date)}
            placeholder="انتخاب تاریخ"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            تا تاریخ ایجاد
          </label>
          <CustomDatePicker
            value={formState.toDate || null}
            onChange={(date) => handleInputChange("toDate", date)}
            placeholder="انتخاب تاریخ"
          />
        </div>
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

export default PermissionSearch;
