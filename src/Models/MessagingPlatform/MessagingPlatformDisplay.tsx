import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import MessagingPlatformService from "./MessagingPlatformService";
import { messagingPlatformModelMeta } from "./MessagingPlatformModel.meta";
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

const MessagingPlatformDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: messagingPlatformRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messagingPlatform", id],
    queryFn: () => MessagingPlatformService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.MESSAGING_PLATFORM_EDIT, id));
    navigate(getViewPath(VIEWNAME.MESSAGING_PLATFORM_EDIT, id));
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

  if (!messagingPlatformRecord) {
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
        title={publicMessages.record.displayTitle + " : " + messagingPlatformRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={messagingPlatformModelMeta.fields.platformName.label}
            value={messagingPlatformRecord.platformName}
          />
          <DisplayField
            label={messagingPlatformModelMeta.fields.platformKey.label}
            value={messagingPlatformRecord.platformKey}
          />
          <DisplayField
            label={messagingPlatformModelMeta.fields.apiEndpoint.label}
            value={messagingPlatformRecord.apiEndpoint}
          />
          <DisplayField
            label={messagingPlatformModelMeta.fields.authMethod.label}
            value={messagingPlatformRecord.authMethod}
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default MessagingPlatformDisplay;
