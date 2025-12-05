import React, { useState } from "react";
import Accordion from "@/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import PermissionTable from "./PermissionTable";
import { Navigate, useNavigate } from "react-router-dom";
import PermissionSearch from "./PermissionSearch";
import { useAuth } from "@/stores/AuthContext";
import { Permission } from "@/router/Permission";
import ForbiddenPage from "@/pages/ForbiddenPage";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import PageTransition from "@/components/Layout/PageTransition";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import PageHeader from "@/core/components/general/PageHeader";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { PermissionModelMeta } from "./PermissionModel.meta";

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
        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
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
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default PermissionPage;
