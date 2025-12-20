import React, { useState } from "react";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import PermissionTable from "./PermissionTable";
import { Navigate, useNavigate } from "react-router-dom";
import PermissionSearch from "./PermissionSearch";
import { useAuth } from "@/stores/AuthContext";
import { Permission } from "@/router/Permission";
import ForbiddenPage from "@/pages/ForbiddenPage";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import PageHeader from "@/core/components/general/container/PageHeader";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { PermissionModelMeta } from "./PermissionModel.meta";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import Accordion from "@/core/components/general/Accordion";

const PermissionPage: React.FC = () => {
  const { hasPermission } = useAuth();


  if (!hasPermission(Permission.Permission_Read)) {
    return <ForbiddenPage />;
  }

  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
    
          <PageHeader
            title={routeMeta?.label || PermissionModelMeta.messages.manage.title}
            actionButton={{
              label: PermissionModelMeta.messages.createButton,
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
