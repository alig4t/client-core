import Breadcrumb from "@/core/components/general/BreadCrumb";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { VIEWNAME } from "@/router/ViewName";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate,useParams } from "react-router-dom";
import { RoleModelMeta } from "./RoleModel.meta";
import RoleService from "./RoleService";

const RoleDisplay: React.FC = () => {
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
    queryFn: () => RoleService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.ROLE_EDIT, id));
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
        <TableErrorState message={publicMessages.record.notfound} onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <RecordDisplayLayout
        title={publicMessages.record.displayTitle + " : " + roleRecord.id}
        actions={
          <Button permission="role:update" variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField label={RoleModelMeta.fields.name.label} value={roleRecord.name} />
          <DisplayField
            label={RoleModelMeta.fields.users.label}
            value={
              roleRecord.users?.map((item) => item?.username)?.join(", ") || "---"
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default RoleDisplay;
