import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import ComprehensiveEntityService from "./ComprehensiveEntityService";
import { comprehensiveEntityModelMeta } from "./ComprehensiveEntityModel.meta";
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

const ComprehensiveEntityDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();

  const {
    data: comprehensiveEntityRecord,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comprehensiveEntity", id],
    queryFn: () => ComprehensiveEntityService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  if (isLoading) return <ViewPagePlaceholder />;
  if (isError) return <TableErrorState />;

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <RecordDisplayLayout
        title={comprehensiveEntityModelMeta.displayName}
        onEdit={() => navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_EDIT, id))}
        onBack={() => navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITYS))}
      >
        <RowContainer>
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.stringField.label}
            value={comprehensiveEntityRecord?.stringField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.integerField.label}
            value={comprehensiveEntityRecord?.integerField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.longField.label}
            value={comprehensiveEntityRecord?.longField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.doubleField.label}
            value={comprehensiveEntityRecord?.doubleField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.bigDecimalField.label}
            value={comprehensiveEntityRecord?.bigDecimalField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.booleanField.label}
            value={OptionUtils.getLabel(
              comprehensiveEntityRecord?.booleanField ? "true" : "false",
              OptionUtils.YES_OR_NO_OPTIONS
            )}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.dateField.label}
            value={DateUtil.GREGORIAN_TO_JALALI(comprehensiveEntityRecord?.dateField)}
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default ComprehensiveEntityDisplay;
