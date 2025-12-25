import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import UserChannelService from "./UserChannelService";
import { UserChannelModelMeta } from "./UserChannelModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormSelect } from "@/core/components/form/FormSelect";
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

const userChannelSchema = z.object({
  role: Validator.notNull(),
  coreUser: Validator.notNull(),
  channel: Validator.notNull(),
});

type UserChannelFormData = z.infer<typeof userChannelSchema>;

const UserChannelCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["userChannel", id],
    queryFn: () => UserChannelService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: UserChannelFormData) => {
      if (isEditMode) {
        return UserChannelService.update(Number(id), data);
      }
      return UserChannelService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? UserChannelModelMeta.messages.update.success.title
          : UserChannelModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? UserChannelModelMeta.messages.update.success.description
            : UserChannelModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["userChannel"] });
      navigate(getViewPath(VIEWNAME.USER_CHANNEL_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? UserChannelModelMeta.messages.update.error.title
          : UserChannelModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? UserChannelModelMeta.messages.update.error.description
            : UserChannelModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: UserChannelFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.USER_CHANNEL_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? UserChannelModelMeta.messages.pageTitle.edit
      : UserChannelModelMeta.messages.pageTitle.create
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
              ? UserChannelModelMeta.messages.pageTitle.edit
              : UserChannelModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={userChannelSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormSelect
                name="role"
                label={UserChannelModelMeta.fields.role.label}
                options={UserChannelModelMeta.fields.role.options || []}
              />
              <FormAutoComplete
                name="coreUser"
                label={UserChannelModelMeta.fields.coreUser.label}
                service={UserService}
                valueKey="id"
                labelKey={UserModelMeta.displayField}
              />
              <FormAutoComplete
                name="channel"
                label={UserChannelModelMeta.fields.channel.label}
                service={ChannelService}
                valueKey="id"
                labelKey={ChannelModelMeta.displayField}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.USER_CHANNEL_SEARCH))}
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

export default UserChannelCreate;
