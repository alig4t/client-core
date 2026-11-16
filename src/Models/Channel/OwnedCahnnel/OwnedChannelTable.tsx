import CustomDataTable from "@/core/components/Table/CustomDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React from "react";
import type { OwnedChannelModel } from "./OwnedChannelModel";
import { OwnedChannelModelMeta } from "./OwnedChannelModel.meta";
import OwnedChannelService from "./OwnedChannelService";
import { OwnedChannelTableColumns,OwnedChannelTableHeaders } from "./OwnedChannelTableColumns";

interface OwnedChannelTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const OwnedChannelTable: React.FC<OwnedChannelTableProps> = ({ filters }) => {

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
        enableDelete={true} deletePermission="channel:delete"
        customFetchFn={() => OwnedChannelService.authorized()}
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
        enableDelete={true} deletePermission="channel:delete"
        customFetchFn={() => OwnedChannelService.pending()}
      />
    </div>


  );
};

export default OwnedChannelTable;
