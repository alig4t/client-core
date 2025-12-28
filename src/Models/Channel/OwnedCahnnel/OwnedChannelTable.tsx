import React, { useCallback } from "react";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import type { OwnedChannelModel } from "./OwnedChannelModel";
import OwnedChannelService from "./OwnedChannelService";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import { OwnedChannelModelMeta } from "./OwnedChannelModel.meta";
import CustomDataTable from "@/core/components/Table/CustomDataTable";
import { OwnedChannelTableColumns, OwnedChannelTableHeaders } from "./OwnedChannelTableColumns";

interface OwnedChannelTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const OwnedChannelTable: React.FC<OwnedChannelTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <div className="flex flex-col gap-8">

      <CustomDataTable<OwnedChannelModel, DynamicFilters>
        queryKey="owned-channel-active"
        // service={OwnedChannelService}
        header={OwnedChannelTableHeaders}
        renderRow={(item, index, onDelete) => (
          <OwnedChannelTableColumns key={item.id} item={item} onDelete={onDelete} />
        )}
        title={'کانال های من'}
        sortOptions={buildSortOptions(OwnedChannelModelMeta)}
        filters={filters}
        enableDelete={true}
        customFetchFn={(params) => OwnedChannelService.authorized()}
      />

      <CustomDataTable<OwnedChannelModel, DynamicFilters>
        queryKey="owned-channel-pending"
        // service={OwnedChannelService}
        header={OwnedChannelTableHeaders}
        renderRow={(item, index, onDelete) => (
          <OwnedChannelTableColumns key={item.id} item={item} onDelete={onDelete} />
        )}
        title={'کانال های منتظر تایید'}
        sortOptions={buildSortOptions(OwnedChannelModelMeta)}
        filters={filters}
        enableDelete={true}
        customFetchFn={(params) => OwnedChannelService.pending()}
      />
    </div>


  );
};

export default OwnedChannelTable;
