import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { TBODY,THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import { getViewPath } from "@/core/router/RouteUtils";
import { Permission } from "@/router/Permission";
import { VIEWNAME } from "@/router/ViewName";
import { Eye,Trash2 } from "lucide-react";
import React,{ memo } from "react";
import type { KeywordModel } from "./KeywordModel";
import { KeywordModelMeta } from "./KeywordModel.meta";

interface KeywordTableColumnsProps {
  item: KeywordModel;
  onDelete: (id: string | number) => void;
}

export const KeywordTableColumns: React.FC<KeywordTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.keywordText || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.Keyword_Update}
            viewName={VIEWNAME.KEYWORD_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.KEYWORD_DISPLAY, item.id)}
            permission={Permission.Keyword_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.Keyword_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const KeywordTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{KeywordModelMeta.fields.keywordText.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
