import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import FormInput from "@/core/components/form/FormInput";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import Button from "@/core/components/general/button/Button";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";
import PageHeader from "@/core/components/general/container/PageHeader";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";
import Validator from "@/core/forms/validation";
import z from "@/core/forms/zod.config";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { RoleModelMeta } from "@/Models/Role/RoleModel.meta";
import RoleService from "@/Models/Role/RoleService";
import { VIEWNAME } from "@/router/ViewName";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate,useParams } from "react-router-dom";
import { toast } from "sonner";
import { UserModelMeta } from "./UserModel.meta";
import UserService from "./UserService";

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
