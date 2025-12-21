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
import type { KeywordMatchModel } from "./KeywordMatchModel";
import { keywordMatchModelMeta } from "./KeywordMatchModel.meta";
import LinkView from "@/core/components/general/link/LinkView";

interface KeywordMatchTableColumnsProps {
  item: KeywordMatchModel;
  onDelete: (id: string | number) => void;
}

export const KeywordMatchTableColumns: React.FC<KeywordMatchTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.matchedAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.KeywordMatch_Update}
            viewName={VIEWNAME.KEYWORD_MATCH_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.KEYWORD_MATCH_DISPLAY, item.id)}
            permission={Permission.KeywordMatch_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.KeywordMatch_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const KeywordMatchTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{keywordMatchModelMeta.fields.matchedAt.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
