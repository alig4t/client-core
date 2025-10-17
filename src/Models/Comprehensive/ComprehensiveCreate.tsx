// src/pages/PermissionCreate.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "@/components/general/Spinner";
// import { FormWrapper } from "@/components/shared/FormWrapper";
import { FormWrapper } from "@/components/form/FormWrapper";
import { FormInput } from "@/components/form/FormInput";
import ComprehensiveService from "./ComprehensiveService";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import Select from "@/components/form/Select";
import { Checkbox } from "@/components/form/Checkbox";
import { DateInput } from "@/components/form/DateInput";
import { YES_OR_NO_OPTIONS } from "@/core/forms/OptionUtils";
import { FormSelect } from "@/components/form/FormSelect";
import { FormAutoComplete } from "@/components/form/FormAutoComplete";
import UserService from "../User/UserService";
import { UserModelMeta } from "../User/UserModel.meta";

// --- Schema and Type for validation ---
const comprehensiveSchema = z.object({
  stringField: z.string().nonempty("رشته را وارد نمایید"),
  integerField: z.number().nonnegative("عددی مثبت را وارد نمایید"),
});
type ComprehensiveFormData = z.infer<typeof comprehensiveSchema>;

// --- Main Component for Create Permission Page ---
const ComprehensiveCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComprehensive: ComprehensiveFormData) => {
      return ComprehensiveService.create(newComprehensive);
    },
    onSuccess: (data) => {
      toast.success("ایجاد دسترسی موفقیت‌آمیز بود", {
        description: "دسترسی جدید با موفقیت ایجاد شد.",
        position: "bottom-left",
      });
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      // You can navigate to the permissions list page here
      // navigate('/permissions');
    },
    onError: (error: any) => {
      toast.error("خطا در ایجاد دسترسی", {
        description: error?.message || "مشکلی در اتصال به سرور رخ داده است.",
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: ComprehensiveFormData) => {
    console.log(data);
    // mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ایجاد دسترسی جدید</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md max-w-2xl mx-auto">
        <FormWrapper
          schema={comprehensiveSchema}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <FormInput
            name="stringField"
            label={comprehensiveModelMeta.fields.stringField?.label}
            placeholder={comprehensiveModelMeta.fields.stringField?.placeholder}
          />
          <FormInput
            name="integerField"
            type="number"
            label={comprehensiveModelMeta.fields.integerField?.label}
            placeholder={
              comprehensiveModelMeta.fields.integerField?.placeholder
            }
          />

          <FormInput
            name="longField"
            type="number"
            label={comprehensiveModelMeta.fields.longField?.label}
            placeholder={comprehensiveModelMeta.fields.longField?.placeholder}
          />

          <FormInput
            name="doubleField"
            type="number"
            label={comprehensiveModelMeta.fields.doubleField?.label}
            placeholder={comprehensiveModelMeta.fields.doubleField?.placeholder}
          />

          <FormInput
            name="bigDecimalField"
            type="number"
            label={comprehensiveModelMeta.fields.bigDecimalField?.label}
            placeholder={
              comprehensiveModelMeta.fields.bigDecimalField?.placeholder
            }
          />
          <Checkbox
            name="booleanField"
            label={comprehensiveModelMeta.fields.booleanField?.label}
          />

          <DateInput
            name="dateField"
            label={comprehensiveModelMeta.fields.dateField?.label}
            placeholder={comprehensiveModelMeta.fields.dateField?.placeholder}
          />
          <FormSelect
            name="enumField"
            label={comprehensiveModelMeta.fields.enumField?.label}
            placeholder={comprehensiveModelMeta.fields.enumField?.placeholder}
            options={YES_OR_NO_OPTIONS}
          />

          <FormAutoComplete
            name="oneToOneUser"
            label={comprehensiveModelMeta.fields.oneToOneUser?.label}
            // placeholder={
            //   comprehensiveModelMeta.fields.oneToOneUser?.placeholder
            // }
            service={UserService}
            labelKey={UserModelMeta.displayField}
            valueKey="id"
          />

          {/* <PermissionFormFields /> */}

          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`inline-flex items-center px-4 py-3 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300 transition-colors duration-300`}
            >
              {mutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 ml-2" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره"
              )}
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default ComprehensiveCreate;
