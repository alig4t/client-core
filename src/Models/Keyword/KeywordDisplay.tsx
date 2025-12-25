import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import KeywordService from "./KeywordService";
import { KeywordModelMeta } from "./KeywordModel.meta";
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

const KeywordDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: keywordRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["keyword", id],
    queryFn: () => KeywordService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.KEYWORD_EDIT, id));
    navigate(getViewPath(VIEWNAME.KEYWORD_EDIT, id));
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

  if (!keywordRecord) {
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
        title={publicMessages.record.displayTitle + " : " + keywordRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={KeywordModelMeta.fields.keywordText.label}
            value={keywordRecord.keywordText}
          />
          <DisplayField
            label={KeywordModelMeta.fields.coreUser.label}
            value={
              keywordRecord.coreUser ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={keywordRecord.coreUser.id}
                  label={keywordRecord.coreUser.username}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={KeywordModelMeta.fields.channel.label}
            value={
              keywordRecord.channel ? (
                <LinkView
                  viewName={VIEWNAME.CHANNEL_DISPLAY}
                  id={keywordRecord.channel.id}
                  label={keywordRecord.channel.channelName}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={KeywordModelMeta.fields.messages.label}
            value={
              keywordRecord.messages?.map((item: any) => item?.content)?.join(", ") ||
              "---"
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default KeywordDisplay;
