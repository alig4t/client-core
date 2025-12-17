import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { ChannelModel } from "./ChannelModel";
import ChannelService from "./ChannelService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { channelModelMeta } from "./ChannelModel.meta";
import BaseDataTable from "@/core/components/Table/BaseDataTable";
import { ChannelTableColumns, ChannelTableHeaders } from "./ChannelTableColumns";

interface ChannelTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const ChannelTable: React.FC<ChannelTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map(Number).filter(id => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<ChannelModel, DynamicFilters>
      queryKey="channel"
      service={ChannelService}
      header={ChannelTableHeaders}
      renderRow={(item, _, onDelete) => <ChannelTableColumns key={item.id} item={item} onDelete={onDelete} />}
      title={channelModelMeta.messages.list.title}
      sortOptions={buildSortOptions(channelModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete
    />
  );
};

export default ChannelTable;