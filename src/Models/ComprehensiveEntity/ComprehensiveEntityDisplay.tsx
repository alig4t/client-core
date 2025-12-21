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
import ComprehensiveEntityService from "./ComprehensiveEntityService";
import { comprehensiveEntityModelMeta } from "./ComprehensiveEntityModel.meta";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { ComprehensiveEntityEnumFieldEnumLabels } from "./ComprehensiveEntityEnumFieldEnum";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";

const ComprehensiveEntityDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: comprehensiveEntityRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comprehensiveEntity", id],
    queryFn: () => ComprehensiveEntityService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_EDIT, id));
    navigate(getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_EDIT, id));
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

  if (!comprehensiveEntityRecord) {
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
        title={publicMessages.record.displayTitle + " : " + comprehensiveEntityRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.stringField.label}
            value={comprehensiveEntityRecord.stringField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.integerField.label}
            value={comprehensiveEntityRecord.integerField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.longField.label}
            value={comprehensiveEntityRecord.longField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.doubleField.label}
            value={comprehensiveEntityRecord.doubleField?.toFixed(2)}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.bigDecimalField.label}
            value={comprehensiveEntityRecord.bigDecimalField?.toFixed(4)}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.booleanField.label}
            value={OptionUtils.GET_BOOLEAN_OPTION(comprehensiveEntityRecord.booleanField)}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.dateField.label}
            value={DateUtil.GEORGIAN_TO_JALALI(comprehensiveEntityRecord.dateField)}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.localDateField.label}
            value={DateUtil.GEORGIAN_TO_JALALI(comprehensiveEntityRecord.localDateField)}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.localDateTimeField.label}
            value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(
              comprehensiveEntityRecord.localDateTimeField
            )}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.enumField.label}
            value={OptionUtils.getLabel(
              comprehensiveEntityRecord.enumField,
              ComprehensiveEntityEnumFieldEnumLabels
            )}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.uniqueField.label}
            value={comprehensiveEntityRecord.uniqueField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.indexedField.label}
            value={comprehensiveEntityRecord.indexedField}
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.oneToOneUser.label}
            value={
              comprehensiveEntityRecord.oneToOneUser ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={comprehensiveEntityRecord.oneToOneUser.id}
                  label={comprehensiveEntityRecord.oneToOneUser.username}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.manyToOneChannel.label}
            value={
              comprehensiveEntityRecord.manyToOneChannel ? (
                <LinkView
                  viewName={VIEWNAME.CHANNEL_DISPLAY}
                  id={comprehensiveEntityRecord.manyToOneChannel.id}
                  label={comprehensiveEntityRecord.manyToOneChannel.channelName}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.oneToManyKeywords.label}
            value={
              comprehensiveEntityRecord.oneToManyKeywords
                ?.map((item: any) => item?.keyword)
                ?.join(", ") || "---"
            }
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.manyToManyMessages.label}
            value={
              comprehensiveEntityRecord.manyToManyMessages
                ?.map((item: any) => item?.content)
                ?.join(", ") || "---"
            }
          />
          <DisplayField
            label={comprehensiveEntityModelMeta.fields.attachments.label}
            value={
              <FilePreview
                fileId={(comprehensiveEntityRecord as any).attachments?.[0]?.id}
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

export default ComprehensiveEntityDisplay;
