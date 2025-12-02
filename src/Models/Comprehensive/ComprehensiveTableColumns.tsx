import React, { memo } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import LinkView from "@/components/general/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import NavLink from "@/components/Button/NavLink";
import TableLink from "@/core/components/general/TableLink";
import { getViewPath } from "@/router/RouteUtils";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";
import { useAuth } from "@/stores/AuthContext";
import type { ComprehensiveModel } from "./ComprehensiveModel";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";

interface ComprehensiveTableColumnsProps {
    item: ComprehensiveModel;
    onDelete: (id: string | number) => void;
}

const ComprehensiveTableColumns: React.FC<ComprehensiveTableColumnsProps> = memo(({
    item,
    onDelete,
}) => {
    const { hasPermission } = useAuth();

    return (
        <>
            <TBODY>{item.id}</TBODY>
            <TBODY>{item.stringField}</TBODY>
            <TBODY>{item.integerField}</TBODY>
            <TBODY>{item.longField}</TBODY>
            <TBODY>{item.doubleField}</TBODY>
            <TBODY>{item.bigDecimalField}</TBODY>
            <TBODY>{item.booleanField ? "بله" : "خیر"}</TBODY>
            <TBODY>{item.dateField}</TBODY>
            <TBODY>{item.localDateField}</TBODY>
            <TBODY>{item.localDateTimeField}</TBODY>
            <TBODY>{OptionUtils.GET_BOOLEAN_OPTION(item.booleanField)}</TBODY>
            <TBODY>{item.uniqueField}</TBODY>
            <TBODY>{item.indexedField}</TBODY>
            <TBODY>
                <LinkView
                    viewName={VIEWNAME.COMPREHENSIVE_DISPLAY}
                    id={item.oneToOneUser?.id}
                    label={item.oneToOneUser?.username}
                />
            </TBODY>
            <TBODY>{item.manyToOneChannel.channelName}</TBODY>
            <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
            <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

            <TBODY className="flex gap-x-2 justify-center">
                <NavLink
                    variant="edit"
                    permission={Permission.ComprehensiveEntity_Update}
                    viewName={VIEWNAME.COMPREHENSIVE_EDIT}
                    idParam={item.id}
                    tooltipSide="top"
                    className="mr-2"
                />

                {hasPermission(Permission.ComprehensiveEntity_Read) && (
                    <TableLink
                        to={getViewPath(VIEWNAME.COMPREHENSIVE_DISPLAY, item.id)}
                    >
                        <Eye size={20} />
                    </TableLink>
                )}

                {hasPermission(Permission.ComprehensiveEntity_Delete) && (
                    <TableLink
                        tooltipText="حذف"
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={20} />
                    </TableLink>
                )}
            </TBODY>
        </>
    );
});

export const ComprehensiveTableHeaders: React.FC = () => (
    <>
        <THEAD>{comprehensiveModelMeta.fields.id.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.stringField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.integerField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.longField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.doubleField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.bigDecimalField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.booleanField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.dateField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.localDateField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.localDateTimeField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.enumField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.uniqueField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.indexedField.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.oneToOneUser.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.manyToOneChannel.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.createdAt.label}</THEAD>
        <THEAD>{comprehensiveModelMeta.fields.updatedAt.label}</THEAD>
        <THEAD>عملیات</THEAD>
    </>
);

export default ComprehensiveTableColumns;
