import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { PersonModel } from "./PersonModel";
import PersonService from "./PersonService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { PersonModelMeta } from "./PersonModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { PersonTableColumns, PersonTableHeaders } from "./PersonTableColumns";

interface PersonTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const PersonTable: React.FC<PersonTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<PersonModel, DynamicFilters>
      queryKey="person"
      service={PersonService}
      header={PersonTableHeaders}
      renderRow={(item, index, onDelete) => (
        <PersonTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={PersonModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(PersonModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default PersonTable;
