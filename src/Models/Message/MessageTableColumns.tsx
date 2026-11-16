import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { TBODY,THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import { getViewPath } from "@/core/router/RouteUtils";
import { Permission } from "@/router/Permission";
import { VIEWNAME } from "@/router/ViewName";
import { Eye,Trash2 } from "lucide-react";
import React,{ memo } from "react";
import type { MessageModel } from "./MessageModel";
import { MessageModelMeta } from "./MessageModel.meta";

interface MessageTableColumnsProps {
  item: MessageModel;
  onDelete: (id: string | number) => void;
}

export const MessageTableColumns: React.FC<MessageTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.platformMessageId || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.sentAt)}</TBODY>
        <TBODY>{item.senderId || "-"}</TBODY>
        <TBODY>{item.senderUsername || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.Message_Update}
            viewName={VIEWNAME.MESSAGE_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.MESSAGE_DISPLAY, item.id)}
            permission={Permission.Message_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.Message_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const MessageTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{MessageModelMeta.fields.platformMessageId.label}</THEAD>
    <THEAD>{MessageModelMeta.fields.sentAt.label}</THEAD>
    <THEAD>{MessageModelMeta.fields.senderId.label}</THEAD>
    <THEAD>{MessageModelMeta.fields.senderUsername.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
