import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import UserService from "./UserService";
import { UserModelMeta } from "./UserModel.meta";
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
import RoleService from "@/Models/Role/RoleService";
import { RoleModelMeta } from "@/Models/Role/RoleModel.meta";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";

const userSchema = z.object({
  name: Validator.notNull(),
  username: Validator.notNull(),
  roles: Validator.optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => UserService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: UserFormData) => {
      if (isEditMode) {
        return UserService.update(Number(id), data);
      }
      return UserService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? UserModelMeta.messages.update.success.title
          : UserModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? UserModelMeta.messages.update.success.description
            : UserModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(getViewPath(VIEWNAME.USER_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? UserModelMeta.messages.update.error.title
          : UserModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? UserModelMeta.messages.update.error.description
            : UserModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.USER_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? UserModelMeta.messages.pageTitle.edit
      : UserModelMeta.messages.pageTitle.create
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
              ? UserModelMeta.messages.pageTitle.edit
              : UserModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={userSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="name"
                label={UserModelMeta.fields.name.label}
                placeholder={UserModelMeta.fields.name.placeholder}
                maxLength={100}
              />
              <FormInput
                name="username"
                label={UserModelMeta.fields.username.label}
                placeholder={UserModelMeta.fields.username.placeholder}
                maxLength={50}
              />
              <FormAutoComplete
                name="roles"
                label={UserModelMeta.fields.roles.label}
                service={RoleService}
                labelKey={RoleModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.USER_SEARCH))}
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

export default UserCreate;
