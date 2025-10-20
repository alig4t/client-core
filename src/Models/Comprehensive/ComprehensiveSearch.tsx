// src/pages/permission/PermissionSearch.tsx

import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import { FormWrapper } from "@/components/form/FormWrapper";
import { DateInput } from "@/components/form/DateInput";
import { JALALI_TO_GEORGIAN } from "@/core/forms/DateUtils";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { generateZodSchemaCode } from "@/core/scripts/generateZodSchema";
import ButtonPanel from "@/components/Button/ButtonPanel";
import Button from "@/components/Button/Button";
import FormInput from "@/components/form/FormInput";

// --- Form data types ---
interface PermissionSearchForm {
  showName?: string;
  name?: string;
  fromDate?: Value; // ← from the same type as CustomDatePicker
  toDate?: Value; // ← from the same type as CustomDatePicker
}

// const comprehensiveSchema = z.object({
//   stringField: z.string().nonempty("رشته متنی را وارد نمایید"),
//   integerField: z.string().nonempty("رشته عددی را وارد نمایید"),
// });

const comprehensiveSchema = generateZodSchemaCode(comprehensiveModelMeta);
console.log(comprehensiveSchema);

// حالا comprehensiveSchema دقیقاً مثل دستی نویسی شده کار می‌کند
// type ComprehensiveFormData = z.infer<typeof comprehensiveSchema>;

// --- Filter output types ---
export interface ComprehensiveFilters {
  [key: string]: any;
}

interface ComprehensiveSearchProps {
  onApplyFilters: (filters: ComprehensiveFilters) => void;
}

const ComprehensiveSearch: React.FC<ComprehensiveSearchProps> = ({
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
    const filters: ComprehensiveFilters = {};

    if (data.stringField?.trim())
      filters["stringField_like"] = data.stringField.trim();
    if (data.integerField?.trim())
      filters["integerField_like"] = data.integerField.trim();

    if (data.createdAt_ge instanceof DateObject) {
      console.log(data.createdAt_ge.toDate());
      filters["createdAt_ge"] = JALALI_TO_GEORGIAN(data.createdAt_ge);
    }

    if (data.createdAt_le instanceof DateObject) {
      filters["createdAt_le"] = JALALI_TO_GEORGIAN(data.createdAt_le);
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
            name="stringField"
            label={comprehensiveModelMeta.fields["stringField"].label}
            placeholder={"جستجو براساس نام نمایشی..."}
          />
          <FormInput
            name="integerField"
            label={comprehensiveModelMeta.fields["integerField"].label}
            placeholder={"جستجو براساس نام سیستمی..."}
            type="number"
          />
          <DateInput
            name="createdAt_ge"
            label={comprehensiveModelMeta.fields["createdAt"].label + " از"}
          />

          <DateInput
            name="createdAt_le"
            label={comprehensiveModelMeta.fields["createdAt"].label + " تا"}
          />
        </div>

        {/* <div className="flex items-center gap-4 mt-6">
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
        </div> */}

        <ButtonPanel align="start">
          <Button variant="success" type="submit">
            اعمال فیلتر
          </Button>
          <Button variant="secondary" type="submit" onClick={handleClear}>
            حذف فیلتر
          </Button>
        </ButtonPanel>
      </FormWrapper>
    </>
  );
};

export default ComprehensiveSearch;
