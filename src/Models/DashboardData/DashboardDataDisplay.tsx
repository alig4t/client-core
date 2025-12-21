import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import DashboardDataService from "./DashboardDataService";
import { dashboardDataModelMeta } from "./DashboardDataModel.meta";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";

const DashboardDataDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: dashboardDataRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardData", id],
    queryFn: () => DashboardDataService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.DASHBOARD_DATA_EDIT, id));
    navigate(getViewPath(VIEWNAME.DASHBOARD_DATA_EDIT, id));
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <ViewPagePlaceholder />
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <TableErrorState
          message={(error as Error)?.message || "خطا در بارگذاری داده‌ها"}
          onRetry={refetch}
        />
      </PageWrapper>
    );
  }

  if (!dashboardDataRecord) {
    return (
      <PageWrapper>
        <TableErrorState message={publicMessages.record.notfound} onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <RecordDisplayLayout
        title={publicMessages.record.displayTitle + " : " + dashboardDataRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={dashboardDataModelMeta.fields.frequencyCount.label}
            value={dashboardDataRecord.frequencyCount}
          />
          <DisplayField
            label={dashboardDataModelMeta.fields.lastMatchedAt.label}
            value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(
              dashboardDataRecord.lastMatchedAt
            )}
          />
          <DisplayField
            label={dashboardDataModelMeta.fields.coreUser.label}
            value={
              dashboardDataRecord.coreUser ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={dashboardDataRecord.coreUser.id}
                  label={dashboardDataRecord.coreUser.username}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={dashboardDataModelMeta.fields.keyword.label}
            value={
              dashboardDataRecord.keyword ? (
                <LinkView
                  viewName={VIEWNAME.KEYWORD_DISPLAY}
                  id={dashboardDataRecord.keyword.id}
                  label={dashboardDataRecord.keyword.keywordText}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={dashboardDataModelMeta.fields.channel.label}
            value={
              dashboardDataRecord.channel ? (
                <LinkView
                  viewName={VIEWNAME.CHANNEL_DISPLAY}
                  id={dashboardDataRecord.channel.id}
                  label={dashboardDataRecord.channel.channelName}
                />
              ) : (
                "---"
              )
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default DashboardDataDisplay;
