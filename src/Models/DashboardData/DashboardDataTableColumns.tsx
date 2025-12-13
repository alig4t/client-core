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
import type { DashboardDataModel } from "./DashboardDataModel";
import { dashboardDataModelMeta } from "./DashboardDataModel.meta";
import LinkView from "@/core/components/general/link/LinkView";

interface DashboardDataTableColumnsProps {
  item: DashboardDataModel;
  onDelete: (id: string | number) => void;
}

export const DashboardDataTableColumns: React.FC<DashboardDataTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.frequencyCount || "-"}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.lastMatchedAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.DashboardData_Update}
            viewName={VIEWNAME.DASHBOARD_DATA_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.DASHBOARD_DATA_DISPLAY, item.id)}
            permission={Permission.DashboardData_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.DashboardData_Delete}
            variant="danger"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const DashboardDataTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{dashboardDataModelMeta.fields.frequencyCount.label}</THEAD>
    <THEAD>{dashboardDataModelMeta.fields.lastMatchedAt.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
