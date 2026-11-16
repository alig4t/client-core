// src/components/permission/PermissionTableWrapper.tsx

import React,{ useCallback } from "react";

import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import type { PermissionModel } from "./PermissionModel";
import { PermissionModelMeta } from "./PermissionModel.meta";
import PermissionService from "./PermissionService";
import PermissionTableColumns,{ PermissionTableHeaders } from "./PermissionTableColumns";


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
      enableDelete={true} deletePermission="permission:delete"
    />
  );
};

export default PermissionTable;
