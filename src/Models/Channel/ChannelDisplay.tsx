import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import ChannelService from "./ChannelService";
import { ChannelModelMeta } from "./ChannelModel.meta";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { ChannelStatusEnumLabels } from "./ChannelStatusEnum";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";

const ChannelDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: channelRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["channel", id],
    queryFn: () => ChannelService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.CHANNEL_EDIT, id));
    navigate(getViewPath(VIEWNAME.CHANNEL_EDIT, id));
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

  if (!channelRecord) {
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
        title={publicMessages.record.displayTitle + " : " + channelRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={ChannelModelMeta.fields.channelName.label}
            value={channelRecord.channelName}
          />
          <DisplayField
            label={ChannelModelMeta.fields.channelIdentifier.label}
            value={channelRecord.channelIdentifier}
          />
          <DisplayField
            label={ChannelModelMeta.fields.status.label}
            value={OptionUtils.getLabel(channelRecord.status, ChannelStatusEnumLabels)}
          />
          <DisplayField
            label={ChannelModelMeta.fields.platform.label}
            value={
              channelRecord.platform ? (
                <LinkView
                  viewName={VIEWNAME.MESSAGING_PLATFORM_DISPLAY}
                  id={channelRecord.platform.id}
                  label={channelRecord.platform.platformName}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={ChannelModelMeta.fields.bots.label}
            value={
              channelRecord.bots?.map((item: any) => item?.token)?.join(", ") || "---"
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default ChannelDisplay;
