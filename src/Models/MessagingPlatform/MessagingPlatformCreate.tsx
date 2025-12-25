import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import MessagingPlatformService from "./MessagingPlatformService";
import { MessagingPlatformModelMeta } from "./MessagingPlatformModel.meta";
import FormInput from "@/core/components/form/FormInput";
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

const messagingPlatformSchema = z.object({
  platformName: Validator.notNull(),
  platformKey: Validator.notNull(),
  apiEndpoint: Validator.notNull(),
  authMethod: Validator.notNull(),
});

type MessagingPlatformFormData = z.infer<typeof messagingPlatformSchema>;

const MessagingPlatformCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["messagingPlatform", id],
    queryFn: () => MessagingPlatformService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: MessagingPlatformFormData) => {
      if (isEditMode) {
        return MessagingPlatformService.update(Number(id), data);
      }
      return MessagingPlatformService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? MessagingPlatformModelMeta.messages.update.success.title
          : MessagingPlatformModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? MessagingPlatformModelMeta.messages.update.success.description
            : MessagingPlatformModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["messagingPlatform"] });
      navigate(getViewPath(VIEWNAME.MESSAGING_PLATFORM_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? MessagingPlatformModelMeta.messages.update.error.title
          : MessagingPlatformModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? MessagingPlatformModelMeta.messages.update.error.description
            : MessagingPlatformModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: MessagingPlatformFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.MESSAGING_PLATFORM_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? MessagingPlatformModelMeta.messages.pageTitle.edit
      : MessagingPlatformModelMeta.messages.pageTitle.create
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
              ? MessagingPlatformModelMeta.messages.pageTitle.edit
              : MessagingPlatformModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={messagingPlatformSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="platformName"
                label={MessagingPlatformModelMeta.fields.platformName.label}
                placeholder={MessagingPlatformModelMeta.fields.platformName.placeholder}
                maxLength={100}
              />
              <FormInput
                name="platformKey"
                label={MessagingPlatformModelMeta.fields.platformKey.label}
                placeholder={MessagingPlatformModelMeta.fields.platformKey.placeholder}
                maxLength={100}
              />
              <FormInput
                name="apiEndpoint"
                label={MessagingPlatformModelMeta.fields.apiEndpoint.label}
                placeholder={MessagingPlatformModelMeta.fields.apiEndpoint.placeholder}
                maxLength={255}
              />
              <FormInput
                name="authMethod"
                label={MessagingPlatformModelMeta.fields.authMethod.label}
                placeholder={MessagingPlatformModelMeta.fields.authMethod.placeholder}
                maxLength={100}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.MESSAGING_PLATFORM_SEARCH))}
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

export default MessagingPlatformCreate;
