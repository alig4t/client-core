import type { BaseModel } from "../BaseModel";
import type { PermissionModel } from "../Permission/PermissionModel";

export interface RoleModel extends BaseModel {
    name: string;
    permission?: PermissionModel[];
}