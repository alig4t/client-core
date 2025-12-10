// src/components/permission/PermissionTableWrapper.tsx

import React, { useCallback } from "react";

import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import PermissionService from "./PermissionService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { PermissionModelMeta } from "./PermissionModel.meta";
import type { PermissionModel } from "./PermissionModel";
import PermissionTableColumns, { PermissionTableHeaders } from "./PermissionTableColumns";
import BaseDataTable from "@/core/components/Table/BaseDataTable";


interface PermissionTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}


const PermissionTable: React.FC<PermissionTableProps> = ({
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
    <BaseDataTable<PermissionModel, DynamicFilters>
      dataIdKey="id"
      queryKey="permission"
      service={PermissionService}
      title={PermissionModelMeta.messages.list.title}
      header={PermissionTableHeaders}
      renderRow={(item, index, onDelete) => (
        <PermissionTableColumns
          key={item.id}
          item={item}
          onDelete={onDelete}
        />
      )}
      sortOptions={buildSortOptions(PermissionModelMeta)}
      filters={filters}
      defaultSort="createdAt,desc"
      defaultPageSize={10}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
    />
  );
};

export default PermissionTable;
