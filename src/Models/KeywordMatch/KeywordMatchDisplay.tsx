import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import KeywordMatchService from "./KeywordMatchService";
import { keywordMatchModelMeta } from "./KeywordMatchModel.meta";
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
  const breadcrumbItems = useBreadcrumbs();

  const {
    data: keywordMatchRecord,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["keywordMatch", id],
    queryFn: () => KeywordMatchService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  if (isLoading) return <ViewPagePlaceholder />;
  if (isError) return <TableErrorState />;

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <RecordDisplayLayout
        title={keywordMatchModelMeta.displayName}
        onEdit={() => navigate(getViewPath(VIEWNAME.KEYWORD_MATCH_EDIT, id))}
        onBack={() => navigate(getViewPath(VIEWNAME.KEYWORD_MATCHS))}
      >
        <RowContainer>
          <DisplayField
            label={keywordMatchModelMeta.fields.matchedAt.label}
            value={DateUtil.GREGORIAN_TO_JALALI(keywordMatchRecord?.matchedAt)}
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default KeywordMatchDisplay;
