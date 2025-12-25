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
import type { BotModel } from "./BotModel";
import { BotModelMeta } from "./BotModel.meta";
import { BotStatusEnumLabels } from "./BotStatusEnum";
import LinkView from "@/core/components/general/link/LinkView";

interface BotTableColumnsProps {
  item: BotModel;
  onDelete: (id: string | number) => void;
}

export const BotTableColumns: React.FC<BotTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.token || "-"}</TBODY>
        <TBODY>{OptionUtils.getLabel(item.status, BotStatusEnumLabels)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.Bot_Update}
            viewName={VIEWNAME.BOT_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.BOT_DISPLAY, item.id)}
            permission={Permission.Bot_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.Bot_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const BotTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{BotModelMeta.fields.token.label}</THEAD>
    <THEAD>{BotModelMeta.fields.status.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
