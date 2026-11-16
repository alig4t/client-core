import LinkView from "@/core/components/general/link/LinkView";
import TableLink from "@/core/components/general/link/TableLink";
import { TBODY,THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import { getViewPath } from "@/core/router/RouteUtils";
import { Permission } from "@/router/Permission";
import { VIEWNAME } from "@/router/ViewName";
import { Eye,Trash2 } from "lucide-react";
import React,{ memo } from "react";
import type { OwnedChannelModel } from "./OwnedChannelModel";
import { OwnedChannelModelMeta } from "./OwnedChannelModel.meta";
import { OwnedChannelStatusEnumLabels } from "./OwnedChannelStatusEnum";

interface OwnedChannelTableColumnsProps {
  item: OwnedChannelModel;
  onDelete: (id: string | number) => void;
}

export const OwnedChannelTableColumns: React.FC<OwnedChannelTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.displayName || "-"}</TBODY>
        <TBODY>{item.channelTitle || "-"}</TBODY>
        <TBODY>{item.platformName || "-"}</TBODY>
        <TBODY>
          <LinkView
            viewName={VIEWNAME.USER_DISPLAY}
            id={item.ownerId}
            label={item.ownerName || "-"}
          />
        </TBODY>
        <TBODY>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            item.status === 'DRAFT'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              : item.status === 'PENDING'
              ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
              : item.status === 'APPROVED' || item.status === 'ACTIVE'
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}>
            {OptionUtils.getLabel(item.status, OwnedChannelStatusEnumLabels)}
          </span>
        </TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          {/* <NavLink
            variant="edit"
            permission={Permission.Channel_Update}
            viewName={VIEWNAME.CHANNEL_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          /> */}

          <TableLink
            to={getViewPath(VIEWNAME.OWNED_CHANNEL_DISPLAY, item.id)}
            permission={Permission.Channel_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.Channel_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const OwnedChannelTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{OwnedChannelModelMeta.fields.displayName.label}</THEAD>
    <THEAD>{OwnedChannelModelMeta.fields.channelTitle.label}</THEAD>
    <THEAD>{OwnedChannelModelMeta.fields.platformName.label}</THEAD>
    <THEAD>{OwnedChannelModelMeta.fields.ownerName.label}</THEAD>
    <THEAD>{OwnedChannelModelMeta.fields.status.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
