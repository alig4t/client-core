import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { UserModel } from "./UserModel";
import UserService from "./UserService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { UserModelMeta } from "./UserModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { UserTableColumns, UserTableHeaders } from "./UserTableColumns";

interface UserTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const UserTable: React.FC<UserTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<UserModel, DynamicFilters>
      queryKey="user"
      service={UserService}
      header={UserTableHeaders}
      renderRow={(item, index, onDelete) => (
        <UserTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={UserModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(UserModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default UserTable;
