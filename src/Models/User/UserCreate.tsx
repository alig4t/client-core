// src/pages/ComprehensiveCreate.tsx
import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";

import { Checkbox } from "@/core/components/form/Checkbox";
import { DateInput } from "@/core/components/form/DateInput";
import OptionUtils from "@/core/forms/OptionUtils";
import { FormSelect } from "@/core/components/form/FormSelect";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import z from "@/core/forms/zod.config";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import FormInput from "@/core/components/form/FormInput";
import Breadcrumb from "@/core/components/general/BreadCrumb";

import Validator from "@/core/forms/validation";
import { FormUploader } from "@/core/components/form/FormUpload";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import TablePlaceholder from "@/core/components/general/placeHolder/TablePlaceholder";
import { useLoading } from "@/stores/LoadingContext";
import UserService from "../User/UserService";

import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import ChannelService from "../Channel/ChannelService";
import { publicMessages } from "@/core/forms/MessageUtils";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import { UserModelMeta } from "./UserModel.meta";
import RoleService from "../Role/RoleService";
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";

const UserSchema = z.object({
  name: Validator.notNull(),
  username: Validator.notNull(),
});

type UserFormData = z.infer<typeof UserSchema>;

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const queryClient = useQueryClient();
  const isEditMode = !!id; // Detect edit mode
  const { openWaitDialog, closeWaitDialog } = useLoading();

  // Load data in edit mode
  const { data: initialData, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["user", id],
    queryFn: () => UserService.getById(Number(id)),
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
    onSuccess: (data) => {
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
      navigate(getViewPath(VIEWNAME.COMPREHENSIVE_LIST));
    },
    onError: (error: any) => {
      toast.error(
        isEditMode
          ? UserModelMeta.messages.update.error.title
          : UserModelMeta.messages.create.error.title,
        {
          description:
            error?.message ||
            (isEditMode
              ? UserModelMeta.messages.update.error.defaultDescription
              : UserModelMeta.messages.create.error
                .defaultDescription),
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.COMPREHENSIVE_LIST));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? UserModelMeta.messages.pageTitle.edit
      : UserModelMeta.messages.pageTitle.create
  );
  const routeMeta = useRouteMetadata();

  if (isLoadingInitial && isEditMode) {
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
          title={routeMeta?.label || (
            isEditMode
              ? UserModelMeta.messages.pageTitle.edit
              : UserModelMeta.messages.pageTitle.create
          )}
        />

        <CreatePageFormWrapper>
          <FormWrapper
            schema={UserSchema}
            onSubmit={onSubmit}
            className="space-y-6"
            defaultValues={initialData} // Fill form with existing data in edit mode
          >
            <RowContainer numberOfColumns={2}>
              <FormInput
                type="text"
                name="name"
                label={UserModelMeta.fields.name?.label}
                placeholder={
                  UserModelMeta.fields.name?.placeholder
                }
              />
              <FormInput
                type="text"
                name="username"
                label={UserModelMeta.fields.username?.label}
                placeholder={
                  UserModelMeta.fields.username?.placeholder
                }
              />
              <FormAutoComplete
                name="roles"
                label={UserModelMeta.fields.roles?.label}
                service={RoleService}
                labelKey="name"
                valueKey="id"
                multi
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

export default UserCreate;
