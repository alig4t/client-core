import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { PlatformModel } from "./PlatformModel";
import PlatformService from "./PlatformService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { platformModelMeta } from "./PlatformModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { PlatformTableColumns, PlatformTableHeaders } from "./PlatformTableColumns";

interface PlatformTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const PlatformTable: React.FC<PlatformTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map(Number).filter(id => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<PlatformModel, DynamicFilters>
      queryKey="platform"
      service={PlatformService}
      header={PlatformTableHeaders}
      renderRow={(item, _, onDelete) => <PlatformTableColumns key={item.id} item={item} onDelete={onDelete} />}
      title={platformModelMeta.messages.list.title}
      sortOptions={buildSortOptions(platformModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete
    />
  );
};

export default PlatformTable;