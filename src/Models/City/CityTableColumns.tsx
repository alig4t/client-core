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
import type { CityModel } from "./CityModel";
import { cityModelMeta } from "./CityModel.meta";
import LinkView from "@/core/components/general/link/LinkView";

interface CityTableColumnsProps {
  item: CityModel;
  onDelete: (id: string | number) => void;
}

export const CityTableColumns: React.FC<CityTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.cityName || "-"}</TBODY>
        <TBODY>{item.country || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.City_Update}
            viewName={VIEWNAME.CITY_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.CITY_DISPLAY, item.id)}
            permission={Permission.City_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.City_Delete}
            className="text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-colors duration-200"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const CityTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{cityModelMeta.fields.cityName.label}</THEAD>
    <THEAD>{cityModelMeta.fields.country.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
