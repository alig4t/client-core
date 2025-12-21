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
import type { ComprehensiveEntityModel } from "./ComprehensiveEntityModel";
import { comprehensiveEntityModelMeta } from "./ComprehensiveEntityModel.meta";
import { ComprehensiveEntityEnumFieldEnumLabels } from "./ComprehensiveEntityEnumFieldEnum";
import LinkView from "@/core/components/general/link/LinkView";

interface ComprehensiveEntityTableColumnsProps {
  item: ComprehensiveEntityModel;
  onDelete: (id: string | number) => void;
}

export const ComprehensiveEntityTableColumns: React.FC<ComprehensiveEntityTableColumnsProps> =
  memo(({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.stringField || "-"}</TBODY>
        <TBODY>{item.integerField || "-"}</TBODY>
        <TBODY>{item.longField || "-"}</TBODY>
        <TBODY>{item.doubleField || "-"}</TBODY>
        <TBODY>{item.bigDecimalField || "-"}</TBODY>
        <TBODY>{OptionUtils.GET_BOOLEAN_OPTION(item.booleanField)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.dateField)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.ComprehensiveEntity_Update}
            viewName={VIEWNAME.COMPREHENSIVE_ENTITY_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.COMPREHENSIVE_ENTITY_DISPLAY, item.id)}
            permission={Permission.ComprehensiveEntity_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.ComprehensiveEntity_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  });

export const ComprehensiveEntityTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.stringField.label}</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.integerField.label}</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.longField.label}</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.doubleField.label}</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.bigDecimalField.label}</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.booleanField.label}</THEAD>
    <THEAD>{comprehensiveEntityModelMeta.fields.dateField.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
