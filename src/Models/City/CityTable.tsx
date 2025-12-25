import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { CityModel } from "./CityModel";
import CityService from "./CityService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { CityModelMeta } from "./CityModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { CityTableColumns, CityTableHeaders } from "./CityTableColumns";

interface CityTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const CityTable: React.FC<CityTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<CityModel, DynamicFilters>
      queryKey="city"
      service={CityService}
      header={CityTableHeaders}
      renderRow={(item, index, onDelete) => (
        <CityTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={CityModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(CityModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default CityTable;
