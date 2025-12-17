// src/pages/ComprehensiveDisplay.tsx
import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import FilePreview from "@/core/components/form/FilePreview";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import { useNavigate } from "react-router-dom";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";
import UserService from "./UserService";
import { UserModelMeta } from "./UserModel.meta";

const UserDisplayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const navigate = useNavigate();

  // Fetch data with React Query
  const {
    data: userRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comprehensive", id],
    queryFn: () => UserService.getById(Number(id)),
    enabled: !!id, // Execute only when id exists
    ...ReactQueryOptions.displayOptions,
  });



  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.USERS_EDIT, id));
    navigate(getViewPath(VIEWNAME.USERS_EDIT, id));
  };

  // Show different states (Loading, Error, Success)
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

  if (!userRecord) {
    return (
      <PageWrapper>
        <TableErrorState
          message={publicMessages.record.notfound}
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
          title={publicMessages.record.displayTitle + " : " + userRecord.id}
          actions={
            <Button variant="primary" onClick={handleEditClick}>
              ویرایش
            </Button>
          }
        >
          <RowContainer numberOfColumns={3}>
            <DisplayField
              label={UserModelMeta.fields.name.label}
              value={userRecord.name}
            />
            <DisplayField
              label={UserModelMeta.fields.username.label}
              value={userRecord.username}
            />
            <DisplayField
              label={UserModelMeta.fields.createdAt.label}
              value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(userRecord.createdAt)}
            />

            <DisplayField
              label={UserModelMeta.fields.updatedAt.label}
              value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(userRecord.updatedAt)}
            />

          </RowContainer>
        </RecordDisplayLayout>
      </div>
    </PageWrapper>
  );
};

export default UserDisplayPage;
