import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import BotService from "./BotService";
import { botModelMeta } from "./BotModel.meta";
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
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";
import { messagingPlatformModelMeta } from "@/Models/MessagingPlatform/MessagingPlatformModel.meta";

const botSchema = z.object({
  token: Validator.notNull(),
  status: Validator.notNull(),
  platform: Validator.notNull(),
});

type BotFormData = z.infer<typeof botSchema>;

const BotCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["bot", id],
    queryFn: () => BotService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: BotFormData) => {
      if (isEditMode) {
        return BotService.update(Number(id), data);
      }
      return BotService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? botModelMeta.messages.update.success.title
          : botModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? botModelMeta.messages.update.success.description
            : botModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["bot"] });
      navigate(getViewPath(VIEWNAME.BOT_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? botModelMeta.messages.update.error.title
          : botModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? botModelMeta.messages.update.error.description
            : botModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: BotFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.BOT_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? botModelMeta.messages.pageTitle.edit
      : botModelMeta.messages.pageTitle.create
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
              ? botModelMeta.messages.pageTitle.edit
              : botModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={botSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="token"
                label={botModelMeta.fields.token.label}
                placeholder={botModelMeta.fields.token.placeholder}
                maxLength={255}
              />
              <FormSelect
                name="status"
                label={botModelMeta.fields.status.label}
                options={botModelMeta.fields.status.options || []}
              />
              <FormAutoComplete
                name="platform"
                label={botModelMeta.fields.platform.label}
                service={MessagingPlatformService}
                valueKey="id"
                labelKey={messagingPlatformModelMeta.displayField}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.BOT_SEARCH))}
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

export default BotCreate;
