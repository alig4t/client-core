// src/pages/ChannelCreate.tsx
import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import ChannelService from "./ChannelService";
import { channelModelMeta } from "./ChannelModel.meta";
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
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import { publicMessages } from "@/core/forms/MessageUtils";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import OptionUtils from "@/core/forms/OptionUtils";
import { ChannelStatusOption, ChannelStatusOptionLabels } from "./ChannelEnumField";
import PlatformService from "../Platform/PlatformService";

const channelSchema = z.object({
  channelName: Validator.notNull(),
  channelIdentifier: Validator.notNull(),
  status: Validator.notNull(),
  platform: Validator.notNull(),
});

type ChannelFormData = z.infer<typeof channelSchema>;

const ChannelCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: initialData, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["channel", id],
    queryFn: () => ChannelService.getById(Number(id)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: ChannelFormData) =>
      isEditMode
        ? ChannelService.update(Number(id), data)
        : ChannelService.create(data),
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
      navigate(getViewPath(VIEWNAME.CHANNEL_LIST));
    },
    onError: (error: any) => {
      toast.error(
        isEditMode
          ? channelModelMeta.messages.update.error.title
          : channelModelMeta.messages.create.error.title,
        {
          description:
            error?.message ||
            (isEditMode
              ? channelModelMeta.messages.update.error.defaultDescription
              : channelModelMeta.messages.create.error.defaultDescription),
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: ChannelFormData) => mutation.mutate(data);
  const handleCancel = () => navigate(getViewPath(VIEWNAME.CHANNEL_LIST));

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? channelModelMeta.messages.pageTitle.edit
      : channelModelMeta.messages.pageTitle.create
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
        <div className="sm:p-8 min-h-screen font-sans">
          <PageHeader
            title={
              routeMeta?.label ||
              (isEditMode
                ? channelModelMeta.messages.pageTitle.edit
                : channelModelMeta.messages.pageTitle.create)
            }
          />

          <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md max-w-2xl mx-auto">
            <FormWrapper
              schema={channelSchema}
              onSubmit={onSubmit}
              className="space-y-6"
              defaultValues={initialData}
            >
              <RowContainer numberOfColumns={2}>
                <FormInput
                  type="text"
                  name="channelName"
                  label={channelModelMeta.fields.channelName.label}
                  placeholder={channelModelMeta.fields.channelName.placeholder}
                />
                <FormInput
                  type="text"
                  name="channelIdentifier"
                  label={channelModelMeta.fields.channelIdentifier.label}
                  placeholder={channelModelMeta.fields.channelIdentifier.placeholder}
                />
                <FormSelect
                  name="status"
                  label={channelModelMeta.fields.status.label}
                  placeholder="انتخاب وضعیت"
                  options={OptionUtils.getOptions(ChannelStatusOption, ChannelStatusOptionLabels)}
                />
                <FormAutoComplete
                  name="platform"
                  label={channelModelMeta.fields.platform.label}
                  service={PlatformService}
                  labelKey="platformName"
                  valueKey="id"
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

export default ChannelCreate;