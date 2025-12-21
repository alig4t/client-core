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
import type { UserChannelModel } from "./UserChannelModel";
import { userChannelModelMeta } from "./UserChannelModel.meta";
import { UserChannelRoleEnumLabels } from "./UserChannelRoleEnum";
import LinkView from "@/core/components/general/link/LinkView";

interface UserChannelTableColumnsProps {
  item: UserChannelModel;
  onDelete: (id: string | number) => void;
}

export const UserChannelTableColumns: React.FC<UserChannelTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{OptionUtils.getLabel(item.role, UserChannelRoleEnumLabels)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.UserChannel_Update}
            viewName={VIEWNAME.USER_CHANNEL_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.USER_CHANNEL_DISPLAY, item.id)}
            permission={Permission.UserChannel_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.UserChannel_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const UserChannelTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{userChannelModelMeta.fields.role.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
