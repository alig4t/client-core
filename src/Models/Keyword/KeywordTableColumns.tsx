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
import type { KeywordModel } from "./KeywordModel";
import { keywordModelMeta } from "./KeywordModel.meta";
import LinkView from "@/core/components/general/link/LinkView";

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
            variant="danger"
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
    <THEAD>{keywordModelMeta.fields.keywordText.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
