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
import type { PersonModel } from "./PersonModel";
import { personModelMeta } from "./PersonModel.meta";
import LinkView from "@/core/components/general/link/LinkView";

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
            variant="danger"
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
    <THEAD>{personModelMeta.fields.firstName.label}</THEAD>
    <THEAD>{personModelMeta.fields.lastName.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
