// src/pages/permission/PermissionSearch.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import Input from "@/components/form/Input";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { permissionModelMeta } from "./PermissionModel.meta";
import { FormWrapper } from "@/components/form/FormWrapper";
import { FormInput } from "@/components/form/FormInput";
import { DateInput } from "@/components/form/DateInput";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { JALALI_TO_GEORGIAN } from "@/core/forms/DateUtils";
import { z } from "zod";
import { Checkbox } from "@/components/form/Checkbox";

// --- Form data types ---
interface PermissionSearchForm {
  showName?: string;
  name?: string;
  fromDate?: Value; // ← from the same type as CustomDatePicker
  toDate?: Value; // ← from the same type as CustomDatePicker
}

// const permissionSchema = z.object({
//   showName: z.string().nonempty("نام نمایشی را وارد نمایید"),
//   name: z.string().nonempty("نام سیستمی را وارد نمایید"),
// });

// --- Filter output types ---
export interface PermissionFilters {
  [key: string]: any;
}

interface PermissionSearchProps {
  onApplyFilters: (filters: PermissionFilters) => void;
}

const PermissionSearch: React.FC<PermissionSearchProps> = ({
  onApplyFilters,
}) => {
  // const { register, handleSubmit, reset, control } =
  //   useForm<PermissionSearchForm>({
  //     defaultValues: {
  //       showName: "",
  //       name: "",
  //       fromDate: null,
  //       toDate: null,
  //     },
  //   });

  const onSubmit: SubmitHandler<any> = (data) => {
    const filters: PermissionFilters = {};

    if (data.showName?.trim()) filters["showName_like"] = data.showName.trim();
    if (data.name?.trim()) filters["name_like"] = data.name.trim();

    if (data.createdAt_ge instanceof DateObject) {
      console.log(data.createdAt_ge.toDate());
      filters["createdAt_ge"] = JALALI_TO_GEORGIAN(data.createdAt_ge)
    }

    if (data.createdAt_le instanceof DateObject) {
      filters["createdAt_le"] = JALALI_TO_GEORGIAN(data.createdAt_le)
    }

    onApplyFilters(filters);
  };

  const handleClear = () => {
    // reset();
    onApplyFilters({});
  };

  return (
    <>
      <FormWrapper onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            name="showName"
            label={permissionModelMeta.fields["showName"].label}
            placeholder={"جستجو براساس نام نمایشی..."}
          />
          <FormInput
            name="name"
            label={permissionModelMeta.fields["name"].label}
            placeholder={"جستجو براساس نام سیستمی..."}
          />
          <DateInput
            name="createdAt_ge"
            label={permissionModelMeta.fields["createdAt"].label + " از"}
          />
          <Checkbox
            name='is_married'
            label={"آیا ازدواج کرده است؟"}
          />

          <DateInput
            name="createdAt_le"
            label={permissionModelMeta.fields["createdAt"].label + " تا"}
          />
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
      </FormWrapper>
    </>
  );
};

export default PermissionSearch;
