// src/pages/ComprehensiveDisplay.tsx
import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/components/general/RecordDisplayLayout";
import { RowContainer } from "@/components/general/RowContainer";
import LinkView from "@/components/general/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/components/general/DisplayField";
import FilePreview from "@/core/components/form/FilePreview";
import ComprehensiveService from "./ComprehensiveService";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TablePlaceholder from "@/components/Layout/TablePlaceholder";
import TableErrorState from "@/components/Layout/TableErrorState";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { getViewPath } from "@/router/RouteUtils";
import { ComprehensiveEnumFieldOptionLabels } from "./ComprehensiveEnumField";

const ComprehensiveDisplayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const navigate = useNavigate();

  // Fetch data with React Query
  const {
    data: comprehensiveRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comprehensive", id],
    queryFn: () => ComprehensiveService.getById(Number(id)),
    enabled: !!id, // Execute only when id exists
    retry: 1, // Retry once on error
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });



  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs("جزئیات رکورد");

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.COMPREHENSIVE_EDIT, id));
    navigate(getViewPath(VIEWNAME.COMPREHENSIVE_EDIT, id));
  };

  // Show different states (Loading, Error, Success)
  if (isLoading) {
    return (
      <PageWrapper>
        <TablePlaceholder rowCount={1} />
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

  if (!comprehensiveRecord) {
    return (
      <PageWrapper>
        <TableErrorState
          message="رکوردی با این شناسه یافت نشد"
          onRetry={refetch}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="p-8 min-h-screen font-sans">
        <RecordDisplayLayout
          title={`جزئیات رکورد: ${comprehensiveRecord.id}`}
          actions={
            <Button variant="primary" onClick={handleEditClick}>
              ویرایش
            </Button>
          }
        >
          <RowContainer numberOfColumns={3}>
            <DisplayField
              label={comprehensiveModelMeta.fields.stringField.label}
              value={comprehensiveRecord.stringField}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.integerField.label}
              value={comprehensiveRecord.integerField}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.doubleField.label}
              value={comprehensiveRecord.doubleField?.toFixed(2)}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.longField.label}
              value={comprehensiveRecord.longField}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.bigDecimalField.label}
              value={comprehensiveRecord.bigDecimalField?.toFixed(4)}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.booleanField.label}
              value={comprehensiveRecord.booleanField ? "بله" : "خیر"}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.dateField.label}
              value={DateUtil.GEORGIAN_TO_JALALI(comprehensiveRecord.dateField)}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.localDateField.label}
              value={DateUtil.GEORGIAN_TO_JALALI(
                comprehensiveRecord.localDateField
              )}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.localDateTimeField.label}
              value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(
                comprehensiveRecord.localDateTimeField
              )}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.enumField.label}
              value={OptionUtils.getLabel(
                comprehensiveRecord.enumField,
                ComprehensiveEnumFieldOptionLabels
              )}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.uniqueField.label}
              value={comprehensiveRecord.uniqueField}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.indexedField.label}
              value={comprehensiveRecord.indexedField}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.oneToOneUser.label}
              value={
                comprehensiveRecord.oneToOneUser ? (
                  <LinkView
                    viewName={VIEWNAME.COMPREHENSIVE_DISPLAY}
                    id={comprehensiveRecord.oneToOneUser.id}
                    label={comprehensiveRecord.oneToOneUser.username}
                  />
                ) : (
                  "بدون کاربر"
                )
              }
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.manyToOneChannel.label}
              value={
                comprehensiveRecord.manyToOneChannel?.channelName ||
                "بدون کانال"
              }
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.createdAt.label}
              value={DateUtil.GEORGIAN_TO_JALALI(comprehensiveRecord.createdAt)}
            />
            <DisplayField
              label={comprehensiveModelMeta.fields.updatedAt.label}
              value={DateUtil.GEORGIAN_TO_JALALI(comprehensiveRecord.updatedAt)}
            />
            <DisplayField
              label="پیوست"
              value={
                (comprehensiveRecord as any).file ? (
                  <FilePreview
                    fileId={(comprehensiveRecord as any).file.id}
                    previewSize="sm"
                    className="mr-2"
                  />
                ) : (
                  "بدون فایل"
                )
              }
            />

            <DisplayField
              label="پیوست"
              value={
                <FilePreview fileId={37} previewSize="sm" className="mr-2" />
              }
            />
          </RowContainer>
        </RecordDisplayLayout>
      </div>
    </PageWrapper>
  );
};

export default ComprehensiveDisplayPage;
