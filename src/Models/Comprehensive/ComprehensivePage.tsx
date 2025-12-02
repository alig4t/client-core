import React, { useState } from "react";
import Accordion from "@/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";

import { useNavigate } from "react-router-dom";
import ComprehensiveSearch from "./ComprehensiveSearch";
import PageHeader from "@/core/components/general/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import PageTransition from "@/components/Layout/PageTransition";
import ComprehensiveTableWrapper from "./ComprehensiveTable";

import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

const ComprehensivePage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={comprehensiveModelMeta.messages.manage.title}
            actionButton={{
              label: comprehensiveModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title="فیلتر‌ها" startOpen={true}>
            <ComprehensiveSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <ComprehensiveTableWrapper filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default ComprehensivePage;
