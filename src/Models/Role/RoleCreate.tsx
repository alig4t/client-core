import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import RoleService from "./RoleService";
import { RoleModelMeta } from "./RoleModel.meta";
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
import UserService from "@/Models/User/UserService";
import { UserModelMeta } from "@/Models/User/UserModel.meta";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";

const roleSchema = z.object({
  name: Validator.notNull(),
  users: Validator.optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

const RoleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["role", id],
    queryFn: () => RoleService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: RoleFormData) => {
      if (isEditMode) {
        return RoleService.update(Number(id), data);
      }
      return RoleService.create(data);
    },
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
      navigate(getViewPath(VIEWNAME.ROLE_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? RoleModelMeta.messages.update.error.title
          : RoleModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? RoleModelMeta.messages.update.error.description
            : RoleModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: RoleFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.ROLE_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? RoleModelMeta.messages.pageTitle.edit
      : RoleModelMeta.messages.pageTitle.create
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
              ? RoleModelMeta.messages.pageTitle.edit
              : RoleModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={roleSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="name"
                label={RoleModelMeta.fields.name.label}
                placeholder={RoleModelMeta.fields.name.placeholder}
                maxLength={50}
              />
              <FormAutoComplete
                name="users"
                label={RoleModelMeta.fields.users.label}
                service={UserService}
                labelKey={UserModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.ROLE_SEARCH))}
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

export default RoleCreate;
