import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React,{ useCallback } from "react";
import type { KeywordMatchModel } from "./KeywordMatchModel";
import { KeywordMatchModelMeta } from "./KeywordMatchModel.meta";
import KeywordMatchService from "./KeywordMatchService";
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
      renderRow={(item, index, onDelete) => (
        <KeywordMatchTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={KeywordMatchModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(KeywordMatchModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true} deletePermission="keywordmatch:delete"
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default KeywordMatchTable;
