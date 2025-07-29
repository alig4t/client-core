import type { BaseModel } from "../BaseModel";
import type { RoleModel } from "../Role/RoleModel";

export interface UserModel extends BaseModel {
    name: string;
    username: string;
    roles: RoleModel[];
}