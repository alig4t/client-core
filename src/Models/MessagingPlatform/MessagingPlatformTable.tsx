import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { MessagingPlatformModel } from "./MessagingPlatformModel";
import MessagingPlatformService from "./MessagingPlatformService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { MessagingPlatformModelMeta } from "./MessagingPlatformModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import {
  MessagingPlatformTableColumns,
  MessagingPlatformTableHeaders,
} from "./MessagingPlatformTableColumns";

interface MessagingPlatformTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const MessagingPlatformTable: React.FC<MessagingPlatformTableProps> = ({
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
    <BaseDataTable<MessagingPlatformModel, DynamicFilters>
      queryKey="messagingPlatform"
      service={MessagingPlatformService}
      header={MessagingPlatformTableHeaders}
      renderRow={(item, index, onDelete) => (
        <MessagingPlatformTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={MessagingPlatformModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(MessagingPlatformModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true}
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default MessagingPlatformTable;
