import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import ComprehensiveEntityService from "./ComprehensiveEntityService";
import { comprehensiveEntityModelMeta } from "./ComprehensiveEntityModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormSelect } from "@/core/components/form/FormSelect";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import { DateInput } from "@/core/components/form/DateInput";
import { Checkbox } from "@/core/components/form/Checkbox";
import z from "@/core/forms/zod.config";
import Validator from "@/core/forms/validation";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import { publicMessages } from "@/core/forms/MessageUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ChannelService from "@/Models/Channel/ChannelService";
import KeywordService from "@/Models/Keyword/KeywordService";
import UserService from "@/Models/User/UserService";

const comprehensiveEntitySchema = z.object({
  stringField: Validator.text(),
  integerField: Validator.optional(),
  longField: Validator.optional(),
  doubleField: Validator.optional(),
  bigDecimalField: Validator.optional(),
  booleanField: Validator.optional(),
  dateField: Validator.optional(),
  localDateField: Validator.optional(),
  localDateTimeField: Validator.optional(),
  enumField: Validator.optional(),
  uniqueField: Validator.text(),
  indexedField: Validator.optional(),
  oneToOneUser: Validator.notNull(),
  manyToOneChannel: Validator.notNull(),
  oneToManyKeywords: Validator.optional(),
  manyToManyMessages: Validator.optional(),
  attachments: Validator.optional(),
});

type ComprehensiveEntityFormData = z.infer<typeof comprehensiveEntitySchema>;

const ComprehensiveEntityCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["comprehensiveEntity", id],
    queryFn: () => ComprehensiveEntityService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: ComprehensiveEntityFormData) => {
      if (isEditMode) {
        return ComprehensiveEntityService.update(Number(id), data);
      }
      return ComprehensiveEntityService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? publicMessages.updateSuccess : publicMessages.createSuccess
      );
      navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITYS));
    },
    onError: () => {
      toast.error(isEditMode ? publicMessages.updateError : publicMessages.createError);
    },
  });

  const onSubmit = (data: ComprehensiveEntityFormData) => {
    mutation.mutate(data);
  };

  if (isEditMode && isLoading) {
    return <CreatePagePlaceholder />;
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={
              isEditMode
                ? `ویرایش ${comprehensiveEntityModelMeta.displayName}`
                : `ایجاد ${comprehensiveEntityModelMeta.displayName}`
            }
          />

          <FormWrapper
            schema={comprehensiveEntitySchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormAutoComplete
                name="oneToOneUser"
                label={comprehensiveEntityModelMeta.fields.oneToOneUser.label}
                service={UserService}
              />
              <FormAutoComplete
                name="manyToOneChannel"
                label={comprehensiveEntityModelMeta.fields.manyToOneChannel.label}
                service={ChannelService}
              />
              <FormAutoComplete
                name="oneToManyKeywords"
                label={comprehensiveEntityModelMeta.fields.oneToManyKeywords.label}
                service={KeywordService}
                multiple
              />
              <FormAutoComplete
                name="manyToManyMessages"
                label={comprehensiveEntityModelMeta.fields.manyToManyMessages.label}
                service={MessageService}
                multiple
              />
              <FormAutoComplete
                name="attachments"
                label={comprehensiveEntityModelMeta.fields.attachments.label}
                service={DocumentService}
                multiple
              />
            </RowContainer>

            <div className="flex gap-4 mt-6 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITYS))}
              >
                {publicMessages.cancel}
              </Button>
              <Button type="submit" loading={mutation.isPending}>
                {isEditMode ? publicMessages.update : publicMessages.create}
              </Button>
            </div>
          </FormWrapper>
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default ComprehensiveEntityCreate;
