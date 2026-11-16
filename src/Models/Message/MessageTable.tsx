import BaseDataTable from "@/core/components/Table/BaseDataTable";
import type { DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { buildSortOptions } from "@/core/forms/OptionUtils";
import React,{ useCallback } from "react";
import type { MessageModel } from "./MessageModel";
import { MessageModelMeta } from "./MessageModel.meta";
import MessageService from "./MessageService";
import { MessageTableColumns,MessageTableHeaders } from "./MessageTableColumns";

interface MessageTableProps {
  filters: DynamicFilters;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

const MessageTable: React.FC<MessageTableProps> = ({ filters, onSelectionChange }) => {
  const handleSelectionChange = useCallback(
    (ids: (string | number)[]) => {
      const numericIds = ids.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      onSelectionChange?.(numericIds);
    },
    [onSelectionChange]
  );

  return (
    <BaseDataTable<MessageModel, DynamicFilters>
      queryKey="message"
      service={MessageService}
      header={MessageTableHeaders}
      renderRow={(item, index, onDelete) => (
        <MessageTableColumns key={item.id} item={item} onDelete={onDelete} />
      )}
      title={MessageModelMeta.pluralDisplayName}
      sortOptions={buildSortOptions(MessageModelMeta)}
      filters={filters}
      onSelectionChange={handleSelectionChange}
      enableDelete={true} deletePermission="message:delete"
      // defaultSort="createdAt,desc"
      // defaultPageSize={10}
      // dataIdKey="id"
    />
  );
};

export default MessageTable;
