import React, { memo, type ReactNode } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";
import type { RoleModel } from "./RoleModel";
import { RoleModelMeta } from "./RoleModel.meta";

interface RoleTableColumnsProps {
  item: RoleModel;
  onDelete: (id: string | number) => void;
}

export const RoleTableColumns: React.FC<RoleTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.name}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.Role_Update}
            viewName={VIEWNAME.ROLE_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.ROLE_DISPLAY, item.id)}
            permission={Permission.Role_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="O-OøU?"
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800"
            permission={Permission.Role_Delete}
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const RoleTableHeaders: ReactNode = (
  <>
    <THEAD>{RoleModelMeta.fields.id.label}</THEAD>
    <THEAD>{RoleModelMeta.fields.name.label}</THEAD>
    <THEAD>{RoleModelMeta.fields.createdAt.label}</THEAD>
    <THEAD>{RoleModelMeta.fields.updatedAt.label}</THEAD>
    <THEAD>O1U.U,UOOO¦</THEAD>
  </>
);
