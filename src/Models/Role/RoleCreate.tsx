import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
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
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import { publicMessages } from "@/core/forms/MessageUtils";
import RoleService from "./RoleService";
import { RoleModelMeta } from "./RoleModel.meta";

const roleSchema = z.object({
  name: Validator.notNull(),
});

type RoleFormData = z.infer<typeof roleSchema>;

const RoleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: initialData, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["role", id],
    queryFn: () => RoleService.getById(Number(id)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: RoleFormData) =>
      isEditMode
        ? RoleService.update(Number(id), data)
        : RoleService.create(data),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? RoleModelMeta.messages.update.success.title
          : RoleModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? RoleModelMeta.messages.update.success.description
            : RoleModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["role"] });
      navigate(getViewPath(VIEWNAME.ROLE_LIST));
    },
    onError: (error: any) => {
      toast.error(
        isEditMode
          ? RoleModelMeta.messages.update.error.title
          : RoleModelMeta.messages.create.error.title,
        {
          description:
            error?.message ||
            (isEditMode
              ? RoleModelMeta.messages.update.error.defaultDescription
              : RoleModelMeta.messages.create.error.defaultDescription),
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: RoleFormData) => mutation.mutate(data);

  const handleCancel = () => navigate(getViewPath(VIEWNAME.ROLE_LIST));

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? RoleModelMeta.messages.pageTitle.edit
      : RoleModelMeta.messages.pageTitle.create
  );
  const routeMeta = useRouteMetadata();

  if (isLoadingInitial && isEditMode) {
    return (
      <PageWrapper>
        <CreatePagePlaceholder rowCount={2} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="sm:p-8 min-h-screen font-sans">
          <PageHeader
            title={
              routeMeta?.label ||
              (isEditMode
                ? RoleModelMeta.messages.pageTitle.edit
                : RoleModelMeta.messages.pageTitle.create)
            }
          />

          <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md mx-auto">
            <FormWrapper
              schema={roleSchema}
              onSubmit={onSubmit}
              className="space-y-6"
              defaultValues={initialData}
            >
              <RowContainer numberOfColumns={3}>
                <FormInput
                  type="text"
                  name="name"
                  label={RoleModelMeta.fields.name?.label}
                  placeholder={RoleModelMeta.fields.name?.placeholder}
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

export default RoleCreate;
