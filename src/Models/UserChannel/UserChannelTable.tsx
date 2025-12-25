import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { UserChannelModel } from "./UserChannelModel";
import UserChannelService from "./UserChannelService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { UserChannelModelMeta } from "./UserChannelModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import {
  UserChannelTableColumns,
  UserChannelTableHeaders,
} from "./UserChannelTableColumns";

interface UserChannelTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const UserChannelTable: React.FC<UserChannelTableProps> = ({
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
    <BaseDataTable<UserChannelModel, DynamicFilters>
      queryKey="userChannel"
      service={UserChannelService}
      header={UserChannelTableHeaders}
      renderRow={(item, index, onDelete) => (
        <UserChannelTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={UserChannelModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(UserChannelModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default UserChannelTable;
