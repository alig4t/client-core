import React, { useState } from "react";
import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";

import { useNavigate } from "react-router-dom";
import ComprehensiveSearch from "./ComprehensiveSearch";
import PageHeader from "@/core/components/general/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { PageWrapper } from "@/core/components/general/PageWrapper";
import PageTransition from "@/core/components/general/PageTransition";
import ComprehensiveTable from "./ComprehensiveTable";

import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { publicMessages } from "@/core/forms/MessageUtils";

const ComprehensivePage: React.FC = () => {
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
            title={routeMeta?.label || comprehensiveModelMeta.messages.manage.title}
            actionButton={{
              label: comprehensiveModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen={true}>
            <ComprehensiveSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <ComprehensiveTable filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default ComprehensivePage;
