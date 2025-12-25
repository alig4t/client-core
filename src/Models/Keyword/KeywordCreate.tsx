import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import KeywordService from "./KeywordService";
import { KeywordModelMeta } from "./KeywordModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
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
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";
import { MessagingPlatformModelMeta } from "@/Models/MessagingPlatform/MessagingPlatformModel.meta";

const keywordSchema = z.object({
  keywordText: Validator.notNull(),
  coreUser: Validator.notNull(),
  channel: Validator.notNull(),
  messages: Validator.optional(),
});

type KeywordFormData = z.infer<typeof keywordSchema>;

const KeywordCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["keyword", id],
    queryFn: () => KeywordService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: KeywordFormData) => {
      if (isEditMode) {
        return KeywordService.update(Number(id), data);
      }
      return KeywordService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? KeywordModelMeta.messages.update.success.title
          : KeywordModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? KeywordModelMeta.messages.update.success.description
            : KeywordModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["keyword"] });
      navigate(getViewPath(VIEWNAME.KEYWORD_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? KeywordModelMeta.messages.update.error.title
          : KeywordModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? KeywordModelMeta.messages.update.error.description
            : KeywordModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: KeywordFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.KEYWORD_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? KeywordModelMeta.messages.pageTitle.edit
      : KeywordModelMeta.messages.pageTitle.create
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
              ? KeywordModelMeta.messages.pageTitle.edit
              : KeywordModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={keywordSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="keywordText"
                label={KeywordModelMeta.fields.keywordText.label}
                placeholder={KeywordModelMeta.fields.keywordText.placeholder}
                maxLength={100}
              />
              <FormAutoComplete
                name="coreUser"
                label={KeywordModelMeta.fields.coreUser.label}
                service={UserService}
                valueKey="id"
                labelKey={UserModelMeta.displayField}
              />
              <FormAutoComplete
                name="channel"
                label={KeywordModelMeta.fields.channel.label}
                service={ChannelService}
                valueKey="id"
                labelKey={ChannelModelMeta.displayField}
              />
              <FormAutoComplete
                name="messages"
                label={KeywordModelMeta.fields.messages.label}
                service={MessagingPlatformService}
                labelKey={MessagingPlatformModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.KEYWORD_SEARCH))}
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

export default KeywordCreate;
