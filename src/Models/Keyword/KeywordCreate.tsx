import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import KeywordService from "./KeywordService";
import { keywordModelMeta } from "./KeywordModel.meta";
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
import { userModelMeta } from "@/Models/User/UserModel.meta";
import ChannelService from "@/Models/Channel/ChannelService";
import { channelModelMeta } from "@/Models/Channel/ChannelModel.meta";
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";
import { messagingPlatformModelMeta } from "@/Models/MessagingPlatform/MessagingPlatformModel.meta";

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
          ? keywordModelMeta.messages.update.success.title
          : keywordModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? keywordModelMeta.messages.update.success.description
            : keywordModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["keyword"] });
      navigate(getViewPath(VIEWNAME.KEYWORD_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? keywordModelMeta.messages.update.error.title
          : keywordModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? keywordModelMeta.messages.update.error.description
            : keywordModelMeta.messages.create.error.description,
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
      ? keywordModelMeta.messages.pageTitle.edit
      : keywordModelMeta.messages.pageTitle.create
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
              ? keywordModelMeta.messages.pageTitle.edit
              : keywordModelMeta.messages.pageTitle.create
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
                label={keywordModelMeta.fields.keywordText.label}
                placeholder={keywordModelMeta.fields.keywordText.placeholder}
                maxLength={100}
              />
              <FormAutoComplete
                name="coreUser"
                label={keywordModelMeta.fields.coreUser.label}
                service={UserService}
                valueKey="id"
                labelKey={userModelMeta.displayField}
              />
              <FormAutoComplete
                name="channel"
                label={keywordModelMeta.fields.channel.label}
                service={ChannelService}
                valueKey="id"
                labelKey={channelModelMeta.displayField}
              />
              <FormAutoComplete
                name="messages"
                label={keywordModelMeta.fields.messages.label}
                service={MessagingPlatformService}
                labelKey={messagingPlatformModelMeta.displayField}
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
