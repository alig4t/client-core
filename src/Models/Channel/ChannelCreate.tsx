import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import ChannelService from "./ChannelService";
import { channelModelMeta } from "./ChannelModel.meta";
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
import BotService from "@/Models/Bot/BotService";
import { botModelMeta } from "@/Models/Bot/BotModel.meta";
import StepperDemo from "@/core/components/general/stepper/StepperDemo";
import CompactStepper, { type CompactStep } from "@/core/components/general/stepper/CompactStepper";
import { useLoading } from "@/stores/LoadingContext";
import PlatformAuthorizationControllerService, { type DraftDto } from "../MessagingPlatform/PlatformAuthorizationControllerService";

const channelSchema = z.object({
  channelName: Validator.notNull(),
  channelIdentifier: Validator.notNull(),
  status: Validator.notNull(),
  platform: Validator.notNull(),
  bots: Validator.optional(),
});

type ChannelFormData = z.infer<typeof channelSchema>;

const ChannelCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();
  const { openWaitDialog, closeWaitDialog } = useLoading();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["channel", id],
    queryFn: () => ChannelService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: async (data: ChannelFormData) => {
      if (isEditMode) {
        return ChannelService.update(Number(id), data);
      }

      console.log(data)

      openWaitDialog();
      const platform = await MessagingPlatformService.getById(data.platform.id)

     
      console.log(platform)
      let dto : DraftDto  = {
        platformKey:platform.platformKey,
        authorizationType: "MONITORING_CHANNEL"
      }
      const draftResult = await PlatformAuthorizationControllerService.draftAuthorizations(dto)
       closeWaitDialog();
      console.log(draftResult)
      return ChannelService.create({});
      // return new Promise();
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? channelModelMeta.messages.update.success.title
          : channelModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? channelModelMeta.messages.update.success.description
            : channelModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      navigate(getViewPath(VIEWNAME.CHANNEL_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? channelModelMeta.messages.update.error.title
          : channelModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? channelModelMeta.messages.update.error.description
            : channelModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: ChannelFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.CHANNEL_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? channelModelMeta.messages.pageTitle.edit
      : channelModelMeta.messages.pageTitle.create
  );

  if (isLoading && isEditMode) {
    return (
      <PageWrapper>
        <CreatePagePlaceholder rowCount={3} />
      </PageWrapper>
    );
  }

  const steps: CompactStep[] = [
    { id: 1, label: "ثبت کانال" },
    { id: 2, label: "ساخت draft" },
    { id: 3, label: "تایید " },
  ]

  return (
    <PageWrapper>
      <PageTransition>


        {/* <StepperDemo /> */}

        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <PageHeader
          title={
            isEditMode
              ? channelModelMeta.messages.pageTitle.edit
              : channelModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <CompactStepper steps={steps} currentStep={0} className="max-w-lg mx-auto mt-3 mb-8" />

          <FormWrapper
            schema={channelSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="channelName"
                label={channelModelMeta.fields.channelName.label}
                placeholder={channelModelMeta.fields.channelName.placeholder}
                maxLength={100}
              />
              <FormInput
                name="channelIdentifier"
                label={channelModelMeta.fields.channelIdentifier.label}
                placeholder={channelModelMeta.fields.channelIdentifier.placeholder}
                maxLength={255}
              />
              <FormSelect
                name="status"
                label={channelModelMeta.fields.status.label}
                options={channelModelMeta.fields.status.options || []}
              />
              <FormAutoComplete
                name="platform"
                label={channelModelMeta.fields.platform.label}
                service={MessagingPlatformService}
                valueKey="id"
                labelKey={messagingPlatformModelMeta.displayField}
              />
              <FormAutoComplete
                name="bots"
                label={channelModelMeta.fields.bots.label}
                service={BotService}
                labelKey={botModelMeta.displayField}
                valueKey="id"
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.CHANNEL_SEARCH))}
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

export default ChannelCreate;
