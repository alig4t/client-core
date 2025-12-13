import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { KeywordMatchModel } from "./KeywordMatchModel";
import KeywordMatchService from "./KeywordMatchService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { keywordMatchModelMeta } from "./KeywordMatchModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import {
  KeywordMatchTableColumns,
  KeywordMatchTableHeaders,
} from "./KeywordMatchTableColumns";

interface KeywordMatchTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const KeywordMatchTable: React.FC<KeywordMatchTableProps> = ({
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
    <BaseDataTable<KeywordMatchModel, DynamicFilters>
      queryKey="keywordMatch"
      service={KeywordMatchService}
      header={KeywordMatchTableHeaders}
      renderRow={(item, onDelete) => (
        <KeywordMatchTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={keywordMatchModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(keywordMatchModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
    />
  );
};

export default KeywordMatchTable;
