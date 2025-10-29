import React, { useState } from "react";
import Accordion from "@/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";

import { useNavigate } from "react-router-dom";
import ComprehensiveSearch from "./ComprehensiveSearch";
import ComprehensiveTable from "./ComprehensiveTable";
import PageHeader from "@/core/components/general/PageHeader";
import Breadcrumb, {
  type BreadcrumbItem,
} from "@/core/components/general/BreadCrumb";
import { createMessages } from "@/core/forms/MessageUtils";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import { PageWrapper } from "@/components/Layout/PageWrapper";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "خانه", href: "/" },
  { label: "مدیریت دسترسی‌ها" }, // Current page
];

const ComprehensivePage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  return (
    <PageWrapper>
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

        <ComprehensiveTable filters={activeFilters} />
      </div>
    </PageWrapper>
  );
};

export default ComprehensivePage;
