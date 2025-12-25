import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import MessageService from "./MessageService";
import { MessageModelMeta } from "./MessageModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import { DateInput } from "@/core/components/form/DateInput";
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
import ChannelService from "@/Models/Channel/ChannelService";
import { ChannelModelMeta } from "@/Models/Channel/ChannelModel.meta";
import KeywordService from "@/Models/Keyword/KeywordService";
import { KeywordModelMeta } from "@/Models/Keyword/KeywordModel.meta";
import AttachmentService from "@/Models/Attachment/AttachmentService";
import { AttachmentModelMeta } from "@/Models/Attachment/AttachmentModel.meta";

const messageSchema = z.object({
  platformMessageId: Validator.notNull(),
  text: Validator.optional(),
  sentAt: Validator.notNull(),
  senderId: Validator.optional(),
  senderUsername: Validator.optional(),
  channel: Validator.notNull(),
  keywords: Validator.optional(),
  attachments: Validator.optional(),
});

type MessageFormData = z.infer<typeof messageSchema>;

const MessageCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["message", id],
    queryFn: () => MessageService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: MessageFormData) => {
      if (isEditMode) {
        return MessageService.update(Number(id), data);
      }
      return MessageService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? MessageModelMeta.messages.update.success.title
          : MessageModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? MessageModelMeta.messages.update.success.description
            : MessageModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["message"] });
      navigate(getViewPath(VIEWNAME.MESSAGE_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? MessageModelMeta.messages.update.error.title
          : MessageModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? MessageModelMeta.messages.update.error.description
            : MessageModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: MessageFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.MESSAGE_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? MessageModelMeta.messages.pageTitle.edit
      : MessageModelMeta.messages.pageTitle.create
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
              ? MessageModelMeta.messages.pageTitle.edit
              : MessageModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={messageSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="platformMessageId"
                label={MessageModelMeta.fields.platformMessageId.label}
                placeholder={MessageModelMeta.fields.platformMessageId.placeholder}
              />
              <DateInput name="sentAt" label={MessageModelMeta.fields.sentAt.label} />
              <FormInput
                name="senderId"
                label={MessageModelMeta.fields.senderId.label}
                placeholder={MessageModelMeta.fields.senderId.placeholder}
              />
              <FormInput
                name="senderUsername"
                label={MessageModelMeta.fields.senderUsername.label}
                placeholder={MessageModelMeta.fields.senderUsername.placeholder}
              />
              <FormAutoComplete
                name="channel"
                label={MessageModelMeta.fields.channel.label}
                service={ChannelService}
                valueKey="id"
                labelKey={ChannelModelMeta.displayField}
              />
              <FormAutoComplete
                name="keywords"
                label={MessageModelMeta.fields.keywords.label}
                service={KeywordService}
                labelKey={KeywordModelMeta.displayField}
                valueKey="id"
              />
              <FormAutoComplete
                name="attachments"
                label={MessageModelMeta.fields.attachments.label}
                service={AttachmentService}
                labelKey={AttachmentModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.MESSAGE_SEARCH))}
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

export default MessageCreate;
