import React, { memo } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import { VIEWNAME } from "@/router/ViewName";
import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { getViewPath } from "@/core/router/RouteUtils";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";
import type { MessagingPlatformModel } from "./MessagingPlatformModel";
import { messagingPlatformModelMeta } from "./MessagingPlatformModel.meta";
import LinkView from "@/core/components/general/link/LinkView";

interface MessagingPlatformTableColumnsProps {
  item: MessagingPlatformModel;
  onDelete: (id: string | number) => void;
}

export const MessagingPlatformTableColumns: React.FC<MessagingPlatformTableColumnsProps> =
  memo(({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.platformName || "-"}</TBODY>
        <TBODY>{item.platformKey || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.MessagingPlatform_Update}
            viewName={VIEWNAME.MESSAGING_PLATFORM_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.MESSAGING_PLATFORM_DISPLAY, item.id)}
            permission={Permission.MessagingPlatform_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.MessagingPlatform_Delete}
            variant="danger"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  });

export const MessagingPlatformTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{messagingPlatformModelMeta.fields.platformName.label}</THEAD>
    <THEAD>{messagingPlatformModelMeta.fields.platformKey.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
