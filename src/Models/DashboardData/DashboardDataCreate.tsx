import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import KeywordService from "@/Models/Keyword/KeywordService";
import ChannelService from "@/Models/Channel/ChannelService";
import UserService from "@/Models/User/UserService";

const dashboardDataSchema = z.object({
  frequencyCount: Validator.integer(),
  lastMatchedAt: Validator.dateTime(),
  coreUser: Validator.notNull(),
  keyword: Validator.notNull(),
  channel: Validator.notNull(),
});

type DashboardDataFormData = z.infer<typeof dashboardDataSchema>;

const DashboardDataCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

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
        isEditMode ? publicMessages.updateSuccess : publicMessages.createSuccess
      );
      navigate(getViewPath(VIEWNAME.DASHBOARD_DATAS));
    },
    onError: () => {
      toast.error(isEditMode ? publicMessages.updateError : publicMessages.createError);
    },
  });

  const onSubmit = (data: DashboardDataFormData) => {
    mutation.mutate(data);
  };

  if (isEditMode && isLoading) {
    return <CreatePagePlaceholder />;
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={
              isEditMode
                ? `ویرایش ${dashboardDataModelMeta.displayName}`
                : `ایجاد ${dashboardDataModelMeta.displayName}`
            }
          />

          <FormWrapper
            schema={dashboardDataSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormAutoComplete
                name="coreUser"
                label={dashboardDataModelMeta.fields.coreUser.label}
                service={UserService}
              />
              <FormAutoComplete
                name="keyword"
                label={dashboardDataModelMeta.fields.keyword.label}
                service={KeywordService}
              />
              <FormAutoComplete
                name="channel"
                label={dashboardDataModelMeta.fields.channel.label}
                service={ChannelService}
              />
            </RowContainer>

            <div className="flex gap-4 mt-6 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.DASHBOARD_DATAS))}
              >
                {publicMessages.cancel}
              </Button>
              <Button type="submit" loading={mutation.isPending}>
                {isEditMode ? publicMessages.update : publicMessages.create}
              </Button>
            </div>
          </FormWrapper>
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default DashboardDataCreate;
