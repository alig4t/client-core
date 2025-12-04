import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import ComprehensiveService from "./ComprehensiveService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import ModernDataTable from "@/components/Table/ModernDataTable";
import ComprehensiveTableColumns, { ComprehensiveTableHeaders } from "./ComprehensiveTableColumns";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";

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
    <ModernDataTable<ComprehensiveModel, DynamicFilters>
      queryKey="comprehensive"
      service={ComprehensiveService}
      dataIdKey="id"
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
      defaultSort="createdAt,desc"
      defaultPageSize={10}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
    />
  );
};

export default ComprehensiveTable;
