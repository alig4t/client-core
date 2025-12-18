import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { RoleModel } from "./RoleModel";
import RoleService from "./RoleService";
import { RoleModelMeta } from "./RoleModel.meta";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { RoleTableColumns, RoleTableHeaders } from "./RoleTableColumns";

interface RoleTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({
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
    <BaseDataTable<RoleModel, DynamicFilters>
      queryKey="role"
      service={RoleService}
      header={RoleTableHeaders}
      renderRow={(item, index, onDelete) => (
        <RoleTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={RoleModelMeta.messages.list.title}
      sortOptions={buildSortOptions(RoleModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete
    />
  );
};

export default RoleTable;
