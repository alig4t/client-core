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
import type { ChannelModel } from "./ChannelModel";
import { channelModelMeta } from "./ChannelModel.meta";
import { ChannelStatusEnumLabels } from "./ChannelStatusEnum";
import LinkView from "@/core/components/general/link/LinkView";

interface ChannelTableColumnsProps {
  item: ChannelModel;
  onDelete: (id: string | number) => void;
}

export const ChannelTableColumns: React.FC<ChannelTableColumnsProps> = memo(
  ({ item, onDelete }) => {
    return (
      <>
        <TBODY>{item.id}</TBODY>
        <TBODY>{item.channelName || "-"}</TBODY>
        <TBODY>{item.channelIdentifier || "-"}</TBODY>
        <TBODY>{OptionUtils.getLabel(item.status, ChannelStatusEnumLabels)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.createdAt)}</TBODY>
        <TBODY>{DateUtil.GEORGIAN_TO_JALALI(item.updatedAt)}</TBODY>

        <TBODY className="flex gap-x-2 justify-center">
          <NavLink
            variant="edit"
            permission={Permission.Channel_Update}
            viewName={VIEWNAME.CHANNEL_EDIT}
            idParam={item.id}
            tooltipSide="top"
            className="mr-2"
          />

          <TableLink
            to={getViewPath(VIEWNAME.CHANNEL_DISPLAY, item.id)}
            permission={Permission.Channel_Read}
          >
            <Eye size={20} />
          </TableLink>

          <TableLink
            tooltipText="حذف"
            onClick={() => onDelete(item.id)}
            permission={Permission.Channel_Delete}
            variant="danger"
          >
            <Trash2 size={20} />
          </TableLink>
        </TBODY>
      </>
    );
  }
);

export const ChannelTableHeaders = (
  <>
    <THEAD>شناسه</THEAD>
    <THEAD>{channelModelMeta.fields.channelName.label}</THEAD>
    <THEAD>{channelModelMeta.fields.channelIdentifier.label}</THEAD>
    <THEAD>{channelModelMeta.fields.status.label}</THEAD>
    <THEAD>تاریخ ایجاد</THEAD>
    <THEAD>تاریخ ویرایش</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);
