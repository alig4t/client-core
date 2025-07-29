import type { BaseModel } from "../BaseModel";

export interface PermissionModel extends BaseModel {
    name: string;
    showName: string;
}