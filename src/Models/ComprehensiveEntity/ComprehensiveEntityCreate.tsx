import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import ComprehensiveEntityService from "./ComprehensiveEntityService";
import { ComprehensiveEntityModelMeta } from "./ComprehensiveEntityModel.meta";
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
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import UserService from "@/Models/User/UserService";
import { UserModelMeta } from "@/Models/User/UserModel.meta";
import ChannelService from "@/Models/Channel/ChannelService";
import { ChannelModelMeta } from "@/Models/Channel/ChannelModel.meta";
import KeywordService from "@/Models/Keyword/KeywordService";
import { KeywordModelMeta } from "@/Models/Keyword/KeywordModel.meta";
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";
import { MessagingPlatformModelMeta } from "@/Models/MessagingPlatform/MessagingPlatformModel.meta";
import AttachmentService from "@/Models/Attachment/AttachmentService";
import { AttachmentModelMeta } from "@/Models/Attachment/AttachmentModel.meta";

const comprehensiveEntitySchema = z.object({
  stringField: Validator.notNull(),
  integerField: Validator.optional(),
  longField: Validator.optional(),
  doubleField: Validator.optional(),
  bigDecimalField: Validator.optional(),
  booleanField: Validator.optional(),
  dateField: Validator.optional(),
  localDateField: Validator.optional(),
  localDateTimeField: Validator.optional(),
  enumField: Validator.optional(),
  uniqueField: Validator.notNull(),
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
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

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
        isEditMode
          ? ComprehensiveEntityModelMeta.messages.update.success.title
          : ComprehensiveEntityModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? ComprehensiveEntityModelMeta.messages.update.success.description
            : ComprehensiveEntityModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["comprehensiveEntity"] });
      navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? ComprehensiveEntityModelMeta.messages.update.error.title
          : ComprehensiveEntityModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? ComprehensiveEntityModelMeta.messages.update.error.description
            : ComprehensiveEntityModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: ComprehensiveEntityFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? ComprehensiveEntityModelMeta.messages.pageTitle.edit
      : ComprehensiveEntityModelMeta.messages.pageTitle.create
  );

  if (isLoading && isEditMode) {
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
        <PageHeader
          title={
            isEditMode
              ? ComprehensiveEntityModelMeta.messages.pageTitle.edit
              : ComprehensiveEntityModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={comprehensiveEntitySchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="stringField"
                label={ComprehensiveEntityModelMeta.fields.stringField.label}
                placeholder={ComprehensiveEntityModelMeta.fields.stringField.placeholder}
                maxLength={100}
              />
              <FormInput
                name="integerField"
                label={ComprehensiveEntityModelMeta.fields.integerField.label}
                type="number"
              />
              <FormInput
                name="longField"
                label={ComprehensiveEntityModelMeta.fields.longField.label}
                type="number"
              />
              <FormInput
                name="doubleField"
                label={ComprehensiveEntityModelMeta.fields.doubleField.label}
                type="number"
              />
              <Checkbox
                name="booleanField"
                label={ComprehensiveEntityModelMeta.fields.booleanField.label}
              />
              <DateInput
                name="dateField"
                label={ComprehensiveEntityModelMeta.fields.dateField.label}
              />
              <DateInput
                name="localDateField"
                label={ComprehensiveEntityModelMeta.fields.localDateField.label}
              />
              <DateInput
                name="localDateTimeField"
                label={ComprehensiveEntityModelMeta.fields.localDateTimeField.label}
              />
              <FormSelect
                name="enumField"
                label={ComprehensiveEntityModelMeta.fields.enumField.label}
                options={ComprehensiveEntityModelMeta.fields.enumField.options || []}
              />
              <FormInput
                name="uniqueField"
                label={ComprehensiveEntityModelMeta.fields.uniqueField.label}
                placeholder={ComprehensiveEntityModelMeta.fields.uniqueField.placeholder}
              />
              <FormInput
                name="indexedField"
                label={ComprehensiveEntityModelMeta.fields.indexedField.label}
                placeholder={ComprehensiveEntityModelMeta.fields.indexedField.placeholder}
              />
              <FormAutoComplete
                name="oneToOneUser"
                label={ComprehensiveEntityModelMeta.fields.oneToOneUser.label}
                service={UserService}
                valueKey="id"
                labelKey={UserModelMeta.displayField}
              />
              <FormAutoComplete
                name="manyToOneChannel"
                label={ComprehensiveEntityModelMeta.fields.manyToOneChannel.label}
                service={ChannelService}
                valueKey="id"
                labelKey={ChannelModelMeta.displayField}
              />
              <FormAutoComplete
                name="oneToManyKeywords"
                label={ComprehensiveEntityModelMeta.fields.oneToManyKeywords.label}
                service={KeywordService}
                labelKey={KeywordModelMeta.displayField}
                valueKey="id"
              />
              <FormAutoComplete
                name="manyToManyMessages"
                label={ComprehensiveEntityModelMeta.fields.manyToManyMessages.label}
                service={MessagingPlatformService}
                labelKey={MessagingPlatformModelMeta.displayField}
                valueKey="id"
              />
              <FormAutoComplete
                name="attachments"
                label={ComprehensiveEntityModelMeta.fields.attachments.label}
                service={AttachmentService}
                labelKey={AttachmentModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_SEARCH))
                }
              >
                {publicMessages.form.buttons.cancel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={mutation.isPending}
                disabled={mutation.isPending}
              >
                {isEditMode
                  ? publicMessages.form.buttons.update
                  : publicMessages.form.buttons.save}
              </Button>
            </ButtonPanel>
          </FormWrapper>
        </CreatePageFormWrapper>
      </PageTransition>
    </PageWrapper>
  );
};

export default ComprehensiveEntityCreate;
