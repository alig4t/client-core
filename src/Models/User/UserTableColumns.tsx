import React, { memo, type ReactNode } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import { VIEWNAME } from "@/router/ViewName";
import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { getViewPath } from "@/core/router/RouteUtils";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";

import LinkView from "@/core/components/general/link/LinkView";
import type { UserModel } from "./UserModel";
import { UserModelMeta } from "./UserModel.meta";

interface userTableColumnsProps {
    item: UserModel;
    onDelete: (id: string | number) => void;
}

export const UserTableColumns: React.FC<userTableColumnsProps> = memo(({
    item,
    onDelete,
}) => {


    return (
        <>
            <TBODY>{item.id}</TBODY>
            <TBODY>{item.name}</TBODY>
            <TBODY>{item.username}</TBODY>
            <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
            <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>
        
            <TBODY className="flex gap-x-2 justify-center">
                <NavLink
                    variant="edit"
                    permission={Permission.UserChannel_Update}
                    viewName={VIEWNAME.USERS_EDIT}
                    idParam={item.id}
                    tooltipSide="top"
                    className="mr-2"
                />

                <TableLink
                    to={getViewPath(VIEWNAME.USERS_DISPLAY, item.id)}
                    permission={Permission.User_Read}
                >
                    <Eye size={20} />
                </TableLink>

                <TableLink
                    tooltipText="حذف"
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    permission={Permission.UserChannel_Delete}
                >
                    <Trash2 size={20} />
                </TableLink>
            </TBODY>
        </>
    );
});

export const userTableHeaders: ReactNode = (
  <>
    <THEAD>{UserModelMeta.fields.id.label}</THEAD>
    <THEAD>{UserModelMeta.fields.name.label}</THEAD>
    <THEAD>{UserModelMeta.fields.username.label}</THEAD>
    <THEAD>{UserModelMeta.fields.createdAt.label}</THEAD>
    <THEAD>{UserModelMeta.fields.updatedAt.label}</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
