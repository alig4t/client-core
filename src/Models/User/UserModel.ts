import type { BaseModel } from "../../core/models/BaseModel";
import type { RoleModel } from "../Role/RoleModel";

export interface UserModel extends BaseModel {
    name: string;
    username: string;
    roles: RoleModel[];
}

export type UserIdentifier = Pick<UserModel, 'id'>;