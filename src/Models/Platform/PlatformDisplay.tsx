import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import PlatformService from "./PlatformService";
import { platformModelMeta } from "./PlatformModel.meta";
import TableErrorState from "@/core/components/general/TableErrorState";
import { useNavigate } from "react-router-dom";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { VIEWNAME } from "@/router/ViewName";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { publicMessages } from "@/core/forms/MessageUtils";

const PlatformDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["platform", id],
    queryFn: () => PlatformService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <PageWrapper><ViewPagePlaceholder /></PageWrapper>;
  if (isError) return <PageWrapper><TableErrorState message={error?.message || "خطا در بارگذاری"} onRetry={refetch} /></PageWrapper>;
  if (!data) return <PageWrapper><TableErrorState message={publicMessages.record.notfound} onRetry={refetch} /></PageWrapper>;

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="p-8 min-h-screen font-sans">
        <RecordDisplayLayout
          title={`نمایش پلتفرم : ${data.platformName}`}
          actions={<Button variant="primary" onClick={() => navigate(getViewPath(VIEWNAME.PLATFORM_EDIT, id))}>ویرایش</Button>}
        >
          <RowContainer numberOfColumns={2}>
            <DisplayField label={platformModelMeta.fields.platformName.label} value={data.platformName} />
            <DisplayField label={platformModelMeta.fields.platformKey.label} value={data.platformKey} />
            <DisplayField label={platformModelMeta.fields.apiEndpoint.label} value={data.apiEndpoint} />
            <DisplayField label={platformModelMeta.fields.authMethod.label} value={data.authMethod} />
          </RowContainer>
        </RecordDisplayLayout>
      </div>
    </PageWrapper>
  );
};

export default PlatformDisplay;