import Breadcrumb from "@/core/components/general/BreadCrumb";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import DateUtil from "@/core/forms/DateUtils";
import { publicMessages } from "@/core/forms/MessageUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { VIEWNAME } from "@/router/ViewName";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate,useParams } from "react-router-dom";
import { OwnedChannelModelMeta } from "./OwnedChannelModel.meta";
import OwnedChannelService from "./OwnedChannelService";
import { OwnedChannelStatusEnumLabels } from "./OwnedChannelStatusEnum";

const OwnedChannelDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: ownedChannelRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["owned-channel", id],
    queryFn: () => OwnedChannelService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.OWNED_CHANNEL_EDIT, id));
    navigate(getViewPath(VIEWNAME.OWNED_CHANNEL_EDIT, id));
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

  if (!ownedChannelRecord) {
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
        title={publicMessages.record.displayTitle + " : " + ownedChannelRecord.id}
        actions={
          <Button permission="channel:update" variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={OwnedChannelModelMeta.fields.platformKey.label}
            value={ownedChannelRecord.platformKey || "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.provisionalIdentifier.label}
            value={ownedChannelRecord.provisionalIdentifier || "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.displayName.label}
            value={ownedChannelRecord.displayName || "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.channelId.label}
            value={ownedChannelRecord.channelId ? String(ownedChannelRecord.channelId) : "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.channelTitle.label}
            value={ownedChannelRecord.channelTitle || "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.platformName.label}
            value={ownedChannelRecord.platformName || "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.ownerId.label}
            value={
              ownedChannelRecord.ownerId ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={ownedChannelRecord.ownerId}
                  label={String(ownedChannelRecord.ownerId)}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.ownerName.label}
            value={ownedChannelRecord.ownerName || "---"}
          />
          <DisplayField
            label={OwnedChannelModelMeta.fields.status.label}
            value={
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                ownedChannelRecord.status === 'DRAFT'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : ownedChannelRecord.status === 'PENDING'
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                  : ownedChannelRecord.status === 'APPROVED'  || ownedChannelRecord.status === 'ACTIVE'
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}>
                {OptionUtils.getLabel(ownedChannelRecord.status, OwnedChannelStatusEnumLabels)}
              </span>
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
      <RecordDisplayLayout title="اطلاعات سیستمی">
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label="شناسه"
            value={ownedChannelRecord.id}
          />
          <DisplayField
            label="تاریخ ایجاد"
            value={DateUtil.GEORGIAN_TO_JALALI(ownedChannelRecord.createdAt)}
          />
          <DisplayField
            label="تاریخ ویرایش"
            value={DateUtil.GEORGIAN_TO_JALALI(ownedChannelRecord.updatedAt)}
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default OwnedChannelDisplay;
