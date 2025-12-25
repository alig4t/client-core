import type { BaseModel } from "@/core/models/BaseModel";
import type { RoleModel } from "@/Models/Role/RoleModel";

export interface UserModel extends BaseModel {
  name: string;
  username: string;
  roles?: RoleModel[];
}
