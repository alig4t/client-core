import React, { memo, useCallback, type ReactNode } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import ComprehensiveService from "./ComprehensiveService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { ComprehensiveTableColumns, ComprehensiveTableHeaders } from "./ComprehensiveTableColumns";

interface ComprehensiveTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const ComprehensiveTable: React.FC<ComprehensiveTableProps> = ({
  filters,
  onSelectionChange,
}) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<ComprehensiveModel, DynamicFilters>
      queryKey="comprehensive"
      service={ComprehensiveService}
    
      header={ComprehensiveTableHeaders}
      renderRow={(item, index, onDelete) => (
        <ComprehensiveTableColumns
          key={item.id}
          item={item}
          onDelete={onDelete}
        />
      )}
      title={comprehensiveModelMeta.messages.list.title}
      sortOptions={buildSortOptions(comprehensiveModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default ComprehensiveTable;
