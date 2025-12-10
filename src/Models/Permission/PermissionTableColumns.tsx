import React, { memo } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import { VIEWNAME } from "@/router/ViewName";
import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { getViewPath } from "@/core/router/RouteUtils";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";
import type { PermissionModel } from "./PermissionModel";
import { PermissionModelMeta } from "./PermissionModel.meta";

interface PermissionTableColumnsProps {
    item: PermissionModel;
    onDelete: (id: string | number) => void;
}

const PermissionTableColumns: React.FC<PermissionTableColumnsProps> = memo(({
    item,
    onDelete,
}) => {

    return (
        <>
            <TBODY>{item.id}</TBODY>
            <TBODY>{item.showName}</TBODY>
            <TBODY>{item.name}</TBODY>

            <TBODY>{DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(item.createdAt)}</TBODY>
            <TBODY>{DateUtil.GEORGIAN_TO_JALALI_WITH_TIME(item.updatedAt)}</TBODY>

            <TBODY className="flex gap-x-2 justify-center">
                <NavLink
                    variant="edit"
                    permission={Permission.ComprehensiveEntity_Update}
                    viewName={VIEWNAME.COMPREHENSIVE_EDIT}
                    idParam={item.id}
                    tooltipSide="top"
                    className="mr-2"
                />

                <TableLink
                    to={getViewPath(VIEWNAME.COMPREHENSIVE_DISPLAY, item.id)}
                    permission={Permission.ComprehensiveEntity_Read}
                >
                    <Eye size={20} />
                </TableLink>

                <TableLink
                    tooltipText="حذف"
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    permission={Permission.ComprehensiveEntity_Delete}
                >
                    <Trash2 size={20} />
                </TableLink>
            </TBODY>
        </>
    );
});

export const PermissionTableHeaders = (
    <>
        <THEAD>{PermissionModelMeta.fields.id.label}</THEAD>
        <THEAD>{PermissionModelMeta.fields.showName.label}</THEAD>
        <THEAD>{PermissionModelMeta.fields.name.label}</THEAD>
        <THEAD>{PermissionModelMeta.fields.createdAt.label}</THEAD>
        <THEAD>{PermissionModelMeta.fields.updatedAt.label}</THEAD>
        <THEAD>عملیات</THEAD>
    </>
);

export default PermissionTableColumns;
