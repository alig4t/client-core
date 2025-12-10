// src/pages/ComprehensiveCreate.tsx
import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import ComprehensiveService from "./ComprehensiveService";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { Checkbox } from "@/core/components/form/Checkbox";
import { DateInput } from "@/core/components/form/DateInput";
import OptionUtils from "@/core/forms/OptionUtils";
import { FormSelect } from "@/core/components/form/FormSelect";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import z from "@/core/forms/zod.config";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import FormInput from "@/core/components/form/FormInput";
import Breadcrumb from "@/core/components/general/BreadCrumb";

import Validator from "@/core/forms/validation";
import { FormUploader } from "@/core/components/form/FormUpload";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import TablePlaceholder from "@/core/components/general/placeHolder/TablePlaceholder";
import { useLoading } from "@/stores/LoadingContext";
import UserService from "../User/UserService";
import { ComprehensiveEnumFieldOption, ComprehensiveEnumFieldOptionLabels } from "./ComprehensiveEnumField";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import ChannelService from "../Channel/ChannelService";
import { publicMessages } from "@/core/forms/MessageUtils";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";

const comprehensiveSchema = z.object({
  stringField: Validator.optional(),
  integerField: Validator.optional(),
  indexedField: Validator.optional(),
  longField: Validator.optional(),
  doubleField: Validator.optional(),
  bigDecimalField: Validator.optional(),
  booleanField: Validator.optional(),
  dateField: Validator.optional(),
  enumField: Validator.optional(),
  oneToOneUser: Validator.optional(),
  manyToOneChannel: Validator.optional(),
  uniqueField: Validator.optional(),
  attachmentIds: Validator.optional(), // Change to attachments
});

type ComprehensiveFormData = z.infer<typeof comprehensiveSchema>;

const ComprehensiveCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const queryClient = useQueryClient();
  const isEditMode = !!id; // Detect edit mode
  const { openWaitDialog, closeWaitDialog } = useLoading();

  // Load data in edit mode
  const { data: initialData, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["comprehensive", id],
    queryFn: () => ComprehensiveService.getById(Number(id)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: ComprehensiveFormData) => {
      if (isEditMode) {
        return ComprehensiveService.update(Number(id), data);
      }
      return ComprehensiveService.create(
        {
          ...data,
          attachmentIds: [data.attachmentIds] as any
        }

      );
    },
    onSuccess: (data) => {
      toast.success(
        isEditMode
          ? comprehensiveModelMeta.messages.update.success.title
          : comprehensiveModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? comprehensiveModelMeta.messages.update.success.description
            : comprehensiveModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["comprehensive"] });
      navigate(getViewPath(VIEWNAME.COMPREHENSIVE_LIST));
    },
    onError: (error: any) => {
      toast.error(
        isEditMode
          ? comprehensiveModelMeta.messages.update.error.title
          : comprehensiveModelMeta.messages.create.error.title,
        {
          description:
            error?.message ||
            (isEditMode
              ? comprehensiveModelMeta.messages.update.error.defaultDescription
              : comprehensiveModelMeta.messages.create.error
                .defaultDescription),
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: ComprehensiveFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.COMPREHENSIVE_LIST));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? comprehensiveModelMeta.messages.pageTitle.edit
      : comprehensiveModelMeta.messages.pageTitle.create
  );
  const routeMeta = useRouteMetadata();

  if (isLoadingInitial && isEditMode) {
    return (
      <PageWrapper>
         <CreatePagePlaceholder rowCount={3} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="sm:p-8 min-h-screen font-sans">
          <PageHeader
            title={routeMeta?.label || (
              isEditMode
                ? comprehensiveModelMeta.messages.pageTitle.edit
                : comprehensiveModelMeta.messages.pageTitle.create
            )}
          />

          <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md max-w-2xl mx-auto">
            <FormWrapper
              schema={comprehensiveSchema}
              onSubmit={onSubmit}
              className="space-y-6"
              defaultValues={initialData} // Fill form with existing data in edit mode
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
                  type="text"
                  name="uniqueField"
                  label={comprehensiveModelMeta.fields.uniqueField?.label}
                  placeholder={
                    comprehensiveModelMeta.fields.uniqueField?.placeholder
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
                  type="double"
                  label={comprehensiveModelMeta.fields.doubleField?.label}
                  placeholder={
                    comprehensiveModelMeta.fields.doubleField?.placeholder
                  }
                />

                <FormInput
                  name="indexedField"
                  type="text"
                  label={comprehensiveModelMeta.fields.indexedField?.label}
                  placeholder={
                    comprehensiveModelMeta.fields.indexedField?.placeholder
                  }
                />
              </RowContainer>
              <RowContainer numberOfColumns={1}>
                <FormUploader name="attachmentIds" label="پیوست‌ها" />
              </RowContainer>
              <RowContainer numberOfColumns={3}>
                <FormInput
                  name="bigDecimalField"
                  type="bigDecimal"
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
                  options={OptionUtils.getOptions(ComprehensiveEnumFieldOption, ComprehensiveEnumFieldOptionLabels)}
                />
                <FormAutoComplete
                  name="oneToOneUser"
                  label={comprehensiveModelMeta.fields.oneToOneUser?.label}
                  service={UserService}
                  labelKey="username"
                  valueKey="id"
                />

                <FormAutoComplete
                  name="manyToOneChannel"
                  label={comprehensiveModelMeta.fields.manyToOneChannel?.label}
                  service={ChannelService}
                  labelKey="channelName"
                  valueKey="id"
                />
              </RowContainer>
              <ButtonPanel align="end">
                <Button variant="cancel" onClick={handleCancel}>
                  {publicMessages.form.buttons.cancel}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  loading={mutation.isPending}
                  disabled={mutation.isPending}
                >
                  {isEditMode
                    ? publicMessages.form.buttons.update
                    : publicMessages.form.buttons.save}
                </Button>
              </ButtonPanel>
            </FormWrapper>
          </div>
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default ComprehensiveCreate;
