import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import DashboardDataService from "./DashboardDataService";
import { dashboardDataModelMeta } from "./DashboardDataModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import { DateInput } from "@/core/components/form/DateInput";
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
import { userModelMeta } from "@/Models/User/UserModel.meta";
import KeywordService from "@/Models/Keyword/KeywordService";
import { keywordModelMeta } from "@/Models/Keyword/KeywordModel.meta";
import ChannelService from "@/Models/Channel/ChannelService";
import { channelModelMeta } from "@/Models/Channel/ChannelModel.meta";

const dashboardDataSchema = z.object({
  frequencyCount: Validator.notNull(),
  lastMatchedAt: Validator.notNull(),
  coreUser: Validator.notNull(),
  keyword: Validator.notNull(),
  channel: Validator.notNull(),
});

type DashboardDataFormData = z.infer<typeof dashboardDataSchema>;

const DashboardDataCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["dashboardData", id],
    queryFn: () => DashboardDataService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: DashboardDataFormData) => {
      if (isEditMode) {
        return DashboardDataService.update(Number(id), data);
      }
      return DashboardDataService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? dashboardDataModelMeta.messages.update.success.title
          : dashboardDataModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? dashboardDataModelMeta.messages.update.success.description
            : dashboardDataModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      navigate(getViewPath(VIEWNAME.DASHBOARD_DATA_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? dashboardDataModelMeta.messages.update.error.title
          : dashboardDataModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? dashboardDataModelMeta.messages.update.error.description
            : dashboardDataModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: DashboardDataFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.DASHBOARD_DATA_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? dashboardDataModelMeta.messages.pageTitle.edit
      : dashboardDataModelMeta.messages.pageTitle.create
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
              ? dashboardDataModelMeta.messages.pageTitle.edit
              : dashboardDataModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={dashboardDataSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="frequencyCount"
                label={dashboardDataModelMeta.fields.frequencyCount.label}
                type="number"
              />
              <DateInput
                name="lastMatchedAt"
                label={dashboardDataModelMeta.fields.lastMatchedAt.label}
              />
              <FormAutoComplete
                name="coreUser"
                label={dashboardDataModelMeta.fields.coreUser.label}
                service={UserService}
                valueKey="id"
                labelKey={userModelMeta.displayField}
              />
              <FormAutoComplete
                name="keyword"
                label={dashboardDataModelMeta.fields.keyword.label}
                service={KeywordService}
                valueKey="id"
                labelKey={keywordModelMeta.displayField}
              />
              <FormAutoComplete
                name="channel"
                label={dashboardDataModelMeta.fields.channel.label}
                service={ChannelService}
                valueKey="id"
                labelKey={channelModelMeta.displayField}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.DASHBOARD_DATA_SEARCH))}
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

export default DashboardDataCreate;
