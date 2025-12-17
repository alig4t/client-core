import React, { memo } from "react";
import { TBODY, THEAD } from "@/core/components/Table/DataTable";
import NavLink from "@/core/components/general/link/NavLink";
import TableLink from "@/core/components/general/link/TableLink";
import { Eye, Trash2 } from "lucide-react";
import { Permission } from "@/router/Permission";
import type { PlatformModel } from "./PlatformModel";
import { platformModelMeta } from "./PlatformModel.meta";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";

interface Props { item: PlatformModel; onDelete: (id: string | number) => void; }

export const PlatformTableColumns = memo(({ item, onDelete }: Props) => (
  <>
    <TBODY>{item.id}</TBODY>
    <TBODY>{item.platformName}</TBODY>
    <TBODY>{item.platformKey}</TBODY>
    <TBODY>{item.apiEndpoint}</TBODY>
    <TBODY>{item.authMethod}</TBODY>
    <TBODY className="flex gap-x-2 justify-center">
      <NavLink variant="edit" permission={Permission.Platform_Update} viewName={VIEWNAME.PLATFORM_EDIT} idParam={item.id} />
      <TableLink to={getViewPath(VIEWNAME.PLATFORM_DISPLAY, item.id)} permission={Permission.Platform_Read}><Eye size={20} /></TableLink>
      <TableLink onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800" permission={Permission.Platform_Delete}><Trash2 size={20} /></TableLink>
    </TBODY>
  </>
));

export const PlatformTableHeaders = (
  <>
    <THEAD>ID</THEAD>
    <THEAD>{platformModelMeta.fields.platformName.label}</THEAD>
    <THEAD>{platformModelMeta.fields.platformKey.label}</THEAD>
    <THEAD>{platformModelMeta.fields.apiEndpoint.label}</THEAD>
    <THEAD>{platformModelMeta.fields.authMethod.label}</THEAD>
    <THEAD>عملیات</THEAD>
  </>
);