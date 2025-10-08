import React, { useState } from 'react';
import Accordion from '@/components/general/Accordion';
import DynamicFilterForm, { type DynamicFilters } from '@/core/FilterForm/DynamicFilterForm';
import { permissionFiltersConfig } from './PermissionFiltersConfig';
import PermissionsTable from './PermissionsTable';


const PermissionsPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});

  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسترسی‌ها</h1>
      </div>

      <Accordion title="فیلتر‌ها" startOpen={true}>
        <DynamicFilterForm 
          fields={permissionFiltersConfig} 
          onApplyFilters={setActiveFilters} 
        />
      </Accordion>

      <PermissionsTable filters={activeFilters} />
    </div>
  );
};

export default PermissionsPage;