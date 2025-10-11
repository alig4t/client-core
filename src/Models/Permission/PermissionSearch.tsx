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

// --- Form data types ---
interface PermissionSearchForm {
  showName?: string;
  name?: string;
  fromDate?: Value; // ← from the same type as CustomDatePicker
  toDate?: Value; // ← from the same type as CustomDatePicker
}

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
    console.log(data.createdAt_ge.toDate());
    const filters: PermissionFilters = {};

    if (data.showName?.trim()) filters["showName_like"] = data.showName.trim();
    if (data.name?.trim()) filters["name_like"] = data.name.trim();

    if (data.createdAt_ge instanceof DateObject) {
      console.log(data.createdAt_ge.toDate());
      filters["createdAt_ge"] = data.createdAt_ge.toDate();
    }

    if (data.createdAt_le instanceof DateObject) {
      filters["createdAt_le"] = data.createdAt_le.toDate();
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
          />
          <DateInput
            name="createdAt_ge"
            label={permissionModelMeta.fields["createdAt"].label + " از"}
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
