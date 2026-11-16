import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React,{ useCallback } from "react";
import type { ChannelModel } from "./ChannelModel";
import { ChannelModelMeta } from "./ChannelModel.meta";
import ChannelService from "./ChannelService";
import { ChannelTableColumns,ChannelTableHeaders } from "./ChannelTableColumns";

interface ChannelTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const ChannelTable: React.FC<ChannelTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<ChannelModel, DynamicFilters>
      queryKey="channel"
      service={ChannelService}
      header={ChannelTableHeaders}
      renderRow={(item, index, onDelete) => (
        <ChannelTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={ChannelModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(ChannelModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true} deletePermission="channel:delete"
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default ChannelTable;
