import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React,{ useCallback } from "react";
import type { KeywordModel } from "./KeywordModel";
import { KeywordModelMeta } from "./KeywordModel.meta";
import KeywordService from "./KeywordService";
import { KeywordTableColumns,KeywordTableHeaders } from "./KeywordTableColumns";

interface KeywordTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const KeywordTable: React.FC<KeywordTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<KeywordModel, DynamicFilters>
      queryKey="keyword"
      service={KeywordService}
      header={KeywordTableHeaders}
      renderRow={(item, index, onDelete) => (
        <KeywordTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={KeywordModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(KeywordModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true} deletePermission="keyword:delete"
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default KeywordTable;
