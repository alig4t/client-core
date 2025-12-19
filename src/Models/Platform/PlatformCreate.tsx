// src/pages/PlatformCreate.tsx
import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import PlatformService from "./PlatformService";
import { platformModelMeta } from "./PlatformModel.meta";
import z from "@/core/forms/zod.config";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import FormInput from "@/core/components/form/FormInput";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import Validator from "@/core/forms/validation";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import { publicMessages } from "@/core/forms/MessageUtils";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";

const platformSchema = z.object({
  platformName: Validator.notNull(),
  platformKey: Validator.notNull(),
  apiEndpoint: Validator.notNull(),
  authMethod: Validator.notNull(),
});

type PlatformFormData = z.infer<typeof platformSchema>;

const PlatformCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: initialData, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["platform", id],
    queryFn: () => PlatformService.getById(Number(id)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: PlatformFormData) =>
      isEditMode
        ? PlatformService.update(Number(id), data)
        : PlatformService.create(data),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? platformModelMeta.messages.update.success.title
          : platformModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? platformModelMeta.messages.update.success.description
            : platformModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["platform"] });
      navigate(getViewPath(VIEWNAME.PLATFORM_LIST));
    },
    onError: (error: any) => {
      toast.error(
        isEditMode
          ? platformModelMeta.messages.update.error.title
          : platformModelMeta.messages.create.error.title,
        {
          description:
            error?.message ||
            (isEditMode
              ? platformModelMeta.messages.update.error.defaultDescription
              : platformModelMeta.messages.create.error.defaultDescription),
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: PlatformFormData) => mutation.mutate(data);

  const handleCancel = () => navigate(getViewPath(VIEWNAME.PLATFORM_LIST));

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? platformModelMeta.messages.pageTitle.edit
      : platformModelMeta.messages.pageTitle.create
  );
  const routeMeta = useRouteMetadata();

  if (isLoadingInitial && isEditMode)
    return (
      <PageWrapper>
        <CreatePagePlaceholder rowCount={3} />
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <PageHeader
          title={
            routeMeta?.label ||
            (isEditMode
              ? platformModelMeta.messages.pageTitle.edit
              : platformModelMeta.messages.pageTitle.create)
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={platformSchema}
            onSubmit={onSubmit}
            className="space-y-6"
            defaultValues={initialData}
          >
            <RowContainer numberOfColumns={2}>
              <FormInput
                type="text"
                name="platformName"
                label={platformModelMeta.fields.platformName.label}
                placeholder={platformModelMeta.fields.platformName.placeholder}
              />
              <FormInput
                type="text"
                name="platformKey"
                label={platformModelMeta.fields.platformKey.label}
                placeholder={platformModelMeta.fields.platformKey.placeholder}
              />
              <FormInput
                type="text"
                name="apiEndpoint"
                label={platformModelMeta.fields.apiEndpoint.label}
                placeholder={platformModelMeta.fields.apiEndpoint.placeholder}
              />
              <FormInput
                type="text"
                name="authMethod"
                label={platformModelMeta.fields.authMethod.label}
                placeholder={platformModelMeta.fields.authMethod.placeholder}
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
        </CreatePageFormWrapper>

      </PageTransition>
    </PageWrapper>
  );
};

export default PlatformCreate;