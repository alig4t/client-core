// src/pages/ChannelDisplay.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import ChannelService from "./ChannelService";
import { channelModelMeta } from "./ChannelModel.meta";
import TableErrorState from "@/core/components/general/TableErrorState";
import { useNavigate } from "react-router-dom";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { VIEWNAME } from "@/router/ViewName";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { publicMessages } from "@/core/forms/MessageUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import { ChannelStatusOptionLabels } from "./ChannelEnumField";

const ChannelDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["channel", id],
    queryFn: () => ChannelService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <PageWrapper><ViewPagePlaceholder /></PageWrapper>;
  if (isError) return <PageWrapper><TableErrorState message={error?.message || "خطا در بارگذاری"} onRetry={refetch} /></PageWrapper>;
  if (!data) return <PageWrapper><TableErrorState message={publicMessages.record.notfound} onRetry={refetch} /></PageWrapper>;

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="p-8 min-h-screen font-sans">
        <RecordDisplayLayout
          title={`${channelModelMeta.messages.pageTitle.edit} : ${data.channelName}`}
          actions={
            <Button variant="primary" onClick={() => navigate(getViewPath(VIEWNAME.CHANNEL_EDIT, id))}>
              ویرایش
            </Button>
          }
        >
          <RowContainer numberOfColumns={2}>
            <DisplayField label={channelModelMeta.fields.channelName.label} value={data.channelName} />
            <DisplayField label={channelModelMeta.fields.channelIdentifier.label} value={data.channelIdentifier} />
            <DisplayField label={channelModelMeta.fields.status.label} value={OptionUtils.getLabel(data.status, ChannelStatusOptionLabels)} />
            <DisplayField label={channelModelMeta.fields.platform.label} value={data.platform?.platformName || "---"} />
          </RowContainer>
        </RecordDisplayLayout>
      </div>
    </PageWrapper>
  );
};

export default ChannelDisplay;