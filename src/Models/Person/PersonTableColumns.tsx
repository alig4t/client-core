import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { TBODY,THEAD } from "@/core/components/Table/DataTable";
import DateUtil from "@/core/forms/DateUtils";
import { getViewPath } from "@/core/router/RouteUtils";
import { Permission } from "@/router/Permission";
import { VIEWNAME } from "@/router/ViewName";
import { Eye,Trash2 } from "lucide-react";
import React,{ memo } from "react";
import type { PersonModel } from "./PersonModel";
import { PersonModelMeta } from "./PersonModel.meta";

interface PersonTableColumnsProps {
  item: PersonModel;
  onDelete: (id: string | number) => void;
}

export const PersonTableColumns: React.FC<PersonTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.firstName || "-"}</TBODY>
        <TBODY>{item.lastName || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.Person_Update}
            viewName={VIEWNAME.PERSON_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.PERSON_DISPLAY, item.id)}
            permission={Permission.Person_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.Person_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const PersonTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{PersonModelMeta.fields.firstName.label}</THEAD>
    <THEAD>{PersonModelMeta.fields.lastName.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
