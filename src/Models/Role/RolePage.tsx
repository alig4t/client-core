import React, { useState } from "react";
import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { publicMessages } from "@/core/forms/MessageUtils";
import { RoleModelMeta } from "./RoleModel.meta";
import RoleSearch from "./RoleSearch";
import RoleTable from "./RoleTable";

const RolePage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

          <PageHeader
            title={routeMeta?.label || RoleModelMeta.messages.manage.title}
            actionButton={{
              label: RoleModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen>
            <RoleSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <RoleTable filters={activeFilters} />
      </PageTransition>
    </PageWrapper>
  );
};

export default RolePage;
