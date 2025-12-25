import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import FilePreview from "@/core/components/form/FilePreview";
import MessageService from "./MessageService";
import { MessageModelMeta } from "./MessageModel.meta";
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

const MessageDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: messageRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["message", id],
    queryFn: () => MessageService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.MESSAGE_EDIT, id));
    navigate(getViewPath(VIEWNAME.MESSAGE_EDIT, id));
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

  if (!messageRecord) {
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
        title={publicMessages.record.displayTitle + " : " + messageRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={MessageModelMeta.fields.platformMessageId.label}
            value={messageRecord.platformMessageId}
          />
          <DisplayField
            label={MessageModelMeta.fields.text.label}
            value={messageRecord.text}
          />
          <DisplayField
            label={MessageModelMeta.fields.sentAt.label}
            value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(messageRecord.sentAt)}
          />
          <DisplayField
            label={MessageModelMeta.fields.senderId.label}
            value={messageRecord.senderId}
          />
          <DisplayField
            label={MessageModelMeta.fields.senderUsername.label}
            value={messageRecord.senderUsername}
          />
          <DisplayField
            label={MessageModelMeta.fields.channel.label}
            value={
              messageRecord.channel ? (
                <LinkView
                  viewName={VIEWNAME.CHANNEL_DISPLAY}
                  id={messageRecord.channel.id}
                  label={messageRecord.channel.channelName}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={MessageModelMeta.fields.keywords.label}
            value={
              messageRecord.keywords?.map((item: any) => item?.keywordText)?.join(", ") ||
              "---"
            }
          />
          <DisplayField
            label={MessageModelMeta.fields.attachments.label}
            value={
              <FilePreview
                fileId={(messageRecord as any).attachments?.[0]?.id}
                previewSize="sm"
                className="mr-2"
              />
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default MessageDisplay;
