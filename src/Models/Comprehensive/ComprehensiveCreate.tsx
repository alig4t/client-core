// src/pages/PermissionCreate.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// import { FormWrapper } from "@/components/shared/FormWrapper";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import ComprehensiveService from "./ComprehensiveService";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { Checkbox } from "@/core/components/form/Checkbox";
import { DateInput } from "@/core/components/form/DateInput";
import OptionUtils from "@/core/forms/OptionUtils";
import { FormSelect } from "@/core/components/form/FormSelect";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import z from "@/core/forms/zod.config";
import { RowContainer } from "@/components/general/RowContainer";
import ButtonPanel from "@/components/Button/ButtonPanel";
import Button from "@/components/Button/Button";
import PageHeader from "@/core/components/general/PageHeader";
import FormInput from "@/core/components/form/FormInput";

import Breadcrumb, {
  type BreadcrumbItem,
} from "@/core/components/general/BreadCrumb";
import PermissionService from "../Permission/PermissionService";
import { PermissionModelMeta } from "../Permission/PermissionModel.meta";
import Validator from "@/core/forms/validation";
import { FormUploader } from "@/core/components/form/FormUpload";

const comprehensiveSchema = z.object({
  stringField: Validator.notNull(),
  integerField: Validator.notNull(),
  longField: Validator.notNull(),
  doubleField: Validator.notNull(),
  bigDecimalField: Validator.notNull(),
  booleanField: Validator.notNull(),
  dateField: Validator.notNull(),
  enumField: Validator.notNull(),
  oneToOneUser: Validator.optional(),
  file: Validator.optional(),
});
// console.log(generateZodSchemaCode(comprehensiveModelMeta));

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
      toast.success(comprehensiveModelMeta.messages.create.success.title, {
        description: comprehensiveModelMeta.messages.create.success.description,
        position: "bottom-left",
      });
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      // You can navigate to the permissions list page here
      // navigate('/permissions');
    },
    onError: (error: any) => {
      toast.error(comprehensiveModelMeta.messages.create.error.title, {
        description:
          error?.message ||
          comprehensiveModelMeta.messages.create.error.defaultDescription,
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: ComprehensiveFormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "خانه", href: "/" },
    { label: "پورتال", href: "/portal" },
    { label: "مدیریت ترکیبی", href: "/portal/comprehensive" },
    { label: "ایجاد ترکیبی جدید" },
  ];

  return (
    <div dir="rtl">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="p-8 min-h-screen font-sans">
        <PageHeader title="ایجاد ترکیبی جدید" />

        <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md max-w-2xl mx-auto">
          <FormWrapper
            schema={comprehensiveSchema}
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <RowContainer numberOfColumns={2}>
              <FormInput
                type="text"
                name="stringField"
                label={comprehensiveModelMeta.fields.stringField?.label}
                placeholder={
                  comprehensiveModelMeta.fields.stringField?.placeholder
                }
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
                type="long"
                label={comprehensiveModelMeta.fields.longField?.label}
                placeholder={
                  comprehensiveModelMeta.fields.longField?.placeholder
                }
              />

              <FormInput
                name="doubleField"
                type="float"
                label={comprehensiveModelMeta.fields.doubleField?.label}
                placeholder={
                  comprehensiveModelMeta.fields.doubleField?.placeholder
                }
              />
            </RowContainer>
            <RowContainer numberOfColumns={1}>
              <FormUploader name="file" label="فایل" />
            </RowContainer>
            <RowContainer numberOfColumns={3}>
              <FormInput
                name="bigDecimalField"
                type="double"
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
                placeholder={
                  comprehensiveModelMeta.fields.dateField?.placeholder
                }
              />
              <FormSelect
                name="enumField"
                label={comprehensiveModelMeta.fields.enumField?.label}
                placeholder={
                  comprehensiveModelMeta.fields.enumField?.placeholder
                }
                options={OptionUtils.YES_OR_NO_OPTIONS}
              />

              <FormAutoComplete
                name="oneToOneUser"
                label={comprehensiveModelMeta.fields.oneToOneUser?.label}
                // multi
                service={PermissionService}
                labelKey={PermissionModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            {/* <PermissionFormFields /> */}

            {/* <div className="flex items-center justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-400 font-medium hover:bg-gray-100 hover:!text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
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
          </div> */}

            <ButtonPanel align="end">
              <Button variant="cancel" onClick={handleCancel}>
                لغو
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={mutation.isPending}
                disabled={mutation.isPending}
              >
                ذخیره
              </Button>
            </ButtonPanel>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveCreate;
