import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import KeywordMatchService from "./KeywordMatchService";
import { KeywordMatchModelMeta } from "./KeywordMatchModel.meta";
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

const KeywordMatchDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: keywordMatchRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["keywordMatch", id],
    queryFn: () => KeywordMatchService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.KEYWORD_MATCH_EDIT, id));
    navigate(getViewPath(VIEWNAME.KEYWORD_MATCH_EDIT, id));
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

  if (!keywordMatchRecord) {
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
        title={publicMessages.record.displayTitle + " : " + keywordMatchRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={KeywordMatchModelMeta.fields.matchedAt.label}
            value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(keywordMatchRecord.matchedAt)}
          />
          <DisplayField
            label={KeywordMatchModelMeta.fields.messagingPlatform.label}
            value={
              keywordMatchRecord.messagingPlatform ? (
                <LinkView
                  viewName={VIEWNAME.MESSAGING_PLATFORM_DISPLAY}
                  id={keywordMatchRecord.messagingPlatform.id}
                  label={keywordMatchRecord.messagingPlatform.platformName}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={KeywordMatchModelMeta.fields.keyword.label}
            value={
              keywordMatchRecord.keyword ? (
                <LinkView
                  viewName={VIEWNAME.KEYWORD_DISPLAY}
                  id={keywordMatchRecord.keyword.id}
                  label={keywordMatchRecord.keyword.keywordText}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={KeywordMatchModelMeta.fields.coreUser.label}
            value={
              keywordMatchRecord.coreUser ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={keywordMatchRecord.coreUser.id}
                  label={keywordMatchRecord.coreUser.username}
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

export default KeywordMatchDisplay;
