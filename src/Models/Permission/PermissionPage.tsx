import Accordion from "@/core/components/general/Accordion";
import PageTransition from "@/core/components/general/animation/PageTransition";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import PageHeader from "@/core/components/general/container/PageHeader";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import ForbiddenPage from "@/pages/ForbiddenPage";
import { Permission } from "@/router/Permission";
import { useAuth } from "@/stores/AuthContext";
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import { PermissionModelMeta } from "./PermissionModel.meta";
import PermissionSearch from "./PermissionSearch";
import PermissionTable from "./PermissionTable";

const PermissionPage: React.FC = () => {
  const { hasPermission } = useAuth();


  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  if (!hasPermission(Permission.Permission_Read)) {
    return <ForbiddenPage />;
  }
  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
    
          <PageHeader
            title={routeMeta?.label || PermissionModelMeta.messages.manage.title}
            actionButton={{
              label: PermissionModelMeta.messages.createButton,
              permission: "permission:create",
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />

          <Accordion title="فیلتر‌ها" startOpen={true}>
            <PermissionSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <PermissionTable filters={activeFilters} />
    
      </PageTransition>
    </PageWrapper>
  );
};

export default PermissionPage;
