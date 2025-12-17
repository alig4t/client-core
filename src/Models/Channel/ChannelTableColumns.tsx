import React, { memo } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";
import type { ChannelModel } from "./ChannelModel";
import { channelModelMeta } from "./ChannelModel.meta";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import OptionUtils from "@/core/forms/OptionUtils";
import { ChannelStatusOptionLabels } from "./ChannelEnumField";

interface Props { item: ChannelModel; onDelete: (id: string | number) => void; }

export const ChannelTableColumns = memo(({ item, onDelete }: Props) => (
  <>
    <TBODY>{item.id}</TBODY>
    <TBODY>{item.channelName}</TBODY>
    <TBODY>{item.channelIdentifier}</TBODY>
    <TBODY>{OptionUtils.getLabel(item.status, ChannelStatusOptionLabels)}</TBODY>
    <TBODY>{item.platform?.platformName || "---"}</TBODY>
    <TBODY className="flex gap-x-2 justify-center">
      <NavLink variant="edit" permission={Permission.Channel_Update} viewName={VIEWNAME.CHANNEL_EDIT} idParam={item.id} />
      <TableLink to={getViewPath(VIEWNAME.CHANNEL_DISPLAY, item.id)} permission={Permission.Channel_Read}><Eye size={20} /></TableLink>
      <TableLink onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800" permission={Permission.Channel_Delete}><Trash2 size={20} /></TableLink>
    </TBODY>
  </>
));

export const ChannelTableHeaders = (
  <>
    <THEAD>ID</THEAD>
    <THEAD>{channelModelMeta.fields.channelName.label}</THEAD>
    <THEAD>{channelModelMeta.fields.channelIdentifier.label}</THEAD>
    <THEAD>{channelModelMeta.fields.status.label}</THEAD>
    <THEAD>{channelModelMeta.fields.platform.label}</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);