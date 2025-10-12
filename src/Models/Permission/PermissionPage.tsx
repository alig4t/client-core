import React, { useState } from "react";
import Accordion from "@/components/general/Accordion";
import DynamicFilterForm, {
  type DynamicFilters,
} from "@/core/forms/DynamicFilterForm";
import { permissionFiltersConfig } from "./PermissionFiltersConfig";
import PermissionTable from "./PermissionTable";
import { useNavigate } from "react-router-dom";
import PermissionSearch from "./PermissionSearch";

const PermissionPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="!text-2xl font-bold">مدیریت دسترسی‌ها</h1>
        <button
          onClick={() => navigate("create")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          افزودن مورد جدید
        </button>
      </div>
      {/* 
      <Accordion title="فیلتر‌ها" startOpen={true}>
        <DynamicFilterForm
          fields={permissionFiltersConfig}
          onApplyFilters={setActiveFilters}
        />
      </Accordion> */}
      <Accordion title="فیلتر‌ها" startOpen={true}>
        <PermissionSearch onApplyFilters={setActiveFilters} />
      </Accordion>

      <PermissionTable filters={activeFilters} />
    </div>
  );
};

export default PermissionPage;
