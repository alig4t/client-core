import React, { useState } from "react";
import Accordion from "@/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";

import { useNavigate } from "react-router-dom";
import ComprehensiveSearch from "./ComprehensiveSearch";
import ComprehensiveTable from "./ComprehensiveTable";
import PageHeader from "@/components/general/PageHeader";

const ComprehensivePage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  return (
    <div dir="rtl" className="sm:p-8 min-h-screen font-sans max-w-[1600px]">
      
      <PageHeader
        title="مدیریت ترکیبی"
        actionButton={{
          label: "افزودن مورد جدید",
          onClick: () => navigate("create"),
          variant: "success",
        }}
      />


      {/* 
      <Accordion title="فیلتر‌ها" startOpen={true}>
        <DynamicFilterForm
          fields={permissionFiltersConfig}
          onApplyFilters={setActiveFilters}
        />
      </Accordion> */}
      <Accordion title="فیلتر‌ها" startOpen={true}>
        <ComprehensiveSearch onApplyFilters={setActiveFilters} />
      </Accordion>

      <ComprehensiveTable filters={activeFilters} />
    </div>
  );
};

export default ComprehensivePage;
