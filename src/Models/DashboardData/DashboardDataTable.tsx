import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { DashboardDataModel } from "./DashboardDataModel";
import DashboardDataService from "./DashboardDataService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { dashboardDataModelMeta } from "./DashboardDataModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import {
  DashboardDataTableColumns,
  DashboardDataTableHeaders,
} from "./DashboardDataTableColumns";

interface DashboardDataTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const DashboardDataTable: React.FC<DashboardDataTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<DashboardDataModel, DynamicFilters>
      queryKey="dashboardData"
      service={DashboardDataService}
      header={DashboardDataTableHeaders}
      renderRow={(item, onDelete) => (
        <DashboardDataTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={dashboardDataModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(dashboardDataModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
    />
  );
};

export default DashboardDataTable;
