// src/pages/permission/PermissionSearch.tsx

import React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import Input from "@/components/form/Input";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { permissionModelMeta } from "./PermissionModel.meta";

// --- نوع داده‌های فرم ---
interface PermissionSearchForm {
  showName?: string;
  name?: string;
  fromDate?: Value; // ← از همان نوع CustomDatePicker
  toDate?: Value; // ← از همان نوع CustomDatePicker
}

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
  const { register, handleSubmit, reset, setValue, getValues } =
    useForm<PermissionSearchForm>({
      defaultValues: {
        showName: "",
        name: "",
        fromDate: null,
        toDate: null,
      },
    });

  // تابع برای تبدیل Value به رشته ISO (YYYY-MM-DD)
  // const formatDateValue = (value: Value): string | null => {
  //   if (!value) return null;
  //   // اگر DatePicker به‌صورت single است، value یک DateObject است
  //   if (value instanceof DatePicker.DateObject) {
  //     return value.format("YYYY-MM-DD");
  //   }
  //   // اگر آرایه باشه (چندتایی)، اولین مورد رو برمی‌گردونیم (در این مورد نیاز نیست)
  //   if (Array.isArray(value) && value[0]) {
  //     return value[0].format("YYYY-MM-DD");
  //   }
  //   return null;
  // };

  const onSubmit: SubmitHandler<PermissionSearchForm> = (data) => {
    const filters: PermissionFilters = {};

    if (data.showName?.trim()) filters["showName_like"] = data.showName.trim();
    if (data.name?.trim()) filters["name_like"] = data.name.trim();

    // const fromDateStr = formatDateValue(data.fromDate);
    // const toDateStr = formatDateValue(data.toDate);

    // if (data.fromDate) filters["createdAt_ge"] = data.fromDate.toDate();
    // if (data.toDate) filters["createdAt_le"] = data.toDate;

    if (data.fromDate instanceof DateObject) {
      filters["createdAt_ge"] = data.fromDate.toDate();
    }

    if (data.toDate instanceof DateObject) {
      filters["createdAt_le"] = data.toDate.toDate();
    }

    onApplyFilters(filters);
  };

  const handleClear = () => {
    reset();
    onApplyFilters({});
  };

  // مدیریت تغییر تاریخ
  const handleDateChange = (field: "fromDate" | "toDate", value: Value) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* فیلدهای متنی */}
        {(["showName", "name"] as const).map((fieldKey) => {
          const meta = permissionModelMeta.fields[fieldKey];
          return (
            <div key={fieldKey}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {meta?.label}
              </label>
              <Input
                placeholder={`جستجو بر اساس ${meta?.label}...`}
                {...register(fieldKey)}
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
            value={getValues("fromDate") || null}
            onChange={(value) => handleDateChange("fromDate", value)}
            placeholder="انتخاب تاریخ"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            تا تاریخ ایجاد
          </label>
          <CustomDatePicker
            value={getValues("toDate") || null}
            onChange={(value) => handleDateChange("toDate", value)}
            placeholder="انتخاب تاریخ"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          اعمال فیلتر
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-200"
        >
          حذف فیلتر
        </button>
      </div>
    </form>
  );
};

export default PermissionSearch;
