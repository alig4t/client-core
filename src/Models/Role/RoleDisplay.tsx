import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import { VIEWNAME } from "@/router/ViewName";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";
import RoleService from "./RoleService";
import { RoleModelMeta } from "./RoleModel.meta";

const RoleDisplayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: roleRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["role", id],
    queryFn: () => RoleService.getById(Number(id)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  const handleEditClick = () => {
    navigate(getViewPath(VIEWNAME.ROLE_EDIT, id));
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

  if (!roleRecord) {
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
        <RecordDisplayLayout
          title={publicMessages.record.displayTitle + " : " + roleRecord.id}
          actions={
            <Button variant="primary" onClick={handleEditClick}>
              ویرایش'
            </Button>
          }
        >
          <RowContainer numberOfColumns={3}>
            <DisplayField
              label={RoleModelMeta.fields.name.label}
              value={roleRecord.name}
            />
            <DisplayField
              label={RoleModelMeta.fields.createdAt.label}
              value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(
                roleRecord.createdAt
              )}
            />
            <DisplayField
              label={RoleModelMeta.fields.updatedAt.label}
              value={DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(
                roleRecord.updatedAt
              )}
            />
          </RowContainer>
        </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default RoleDisplayPage;
