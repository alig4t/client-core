import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { BotModel } from "./BotModel";
import BotService from "./BotService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { BotModelMeta } from "./BotModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { BotTableColumns, BotTableHeaders } from "./BotTableColumns";

interface BotTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const BotTable: React.FC<BotTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<BotModel, DynamicFilters>
      queryKey="bot"
      service={BotService}
      header={BotTableHeaders}
      renderRow={(item, index, onDelete) => (
        <BotTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={BotModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(BotModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default BotTable;
