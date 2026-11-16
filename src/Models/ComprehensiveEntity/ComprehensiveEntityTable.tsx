import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React,{ useCallback } from "react";
import type { ComprehensiveEntityModel } from "./ComprehensiveEntityModel";
import { ComprehensiveEntityModelMeta } from "./ComprehensiveEntityModel.meta";
import ComprehensiveEntityService from "./ComprehensiveEntityService";
import {
ComprehensiveEntityTableColumns,
ComprehensiveEntityTableHeaders,
} from "./ComprehensiveEntityTableColumns";

interface ComprehensiveEntityTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const ComprehensiveEntityTable: React.FC<ComprehensiveEntityTableProps> = ({
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
    <BaseDataTable<ComprehensiveEntityModel, DynamicFilters>
      queryKey="comprehensiveEntity"
      service={ComprehensiveEntityService}
      header={ComprehensiveEntityTableHeaders}
      renderRow={(item, index, onDelete) => (
        <ComprehensiveEntityTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={ComprehensiveEntityModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(ComprehensiveEntityModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true} deletePermission="comprehensiveentity:delete"
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default ComprehensiveEntityTable;
