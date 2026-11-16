import Accordion from "@/core/components/general/Accordion";
import PageTransition from "@/core/components/general/animation/PageTransition";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import PageHeader from "@/core/components/general/container/PageHeader";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { publicMessages } from "@/core/forms/MessageUtils";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
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

        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={routeMeta?.label || RoleModelMeta.messages.manage.title}
            actionButton={{
              label: RoleModelMeta.messages.createButton,
              permission: "role:create",
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen={true}>
            <RoleSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <RoleTable filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default RolePage;
