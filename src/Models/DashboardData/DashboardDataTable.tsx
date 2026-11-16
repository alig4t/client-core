import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React,{ useCallback } from "react";
import type { DashboardDataModel } from "./DashboardDataModel";
import { DashboardDataModelMeta } from "./DashboardDataModel.meta";
import DashboardDataService from "./DashboardDataService";
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
      renderRow={(item, index, onDelete) => (
        <DashboardDataTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={DashboardDataModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(DashboardDataModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true} deletePermission="dashboarddata:delete"
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default DashboardDataTable;
