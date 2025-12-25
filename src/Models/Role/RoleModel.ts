import type { BaseModel } from "@/core/models/BaseModel";
import type { UserModel } from "@/Models/User/UserModel";

export interface RoleModel extends BaseModel {
  name: string;
  users?: UserModel[];
}
