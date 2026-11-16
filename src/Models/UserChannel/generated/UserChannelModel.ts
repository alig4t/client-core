import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { UserModel } from "@/Models/User/UserModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
export interface UserChannelModel extends BaseModel<number> {
  role: "OWNER" | "MEMBER";
  coreUser: UserModel;
  channel: ChannelModel;
}
export interface UserChannelCreateInput {
  role: "OWNER" | "MEMBER";
  coreUser: { id: EntityId };
  channel: { id: EntityId };
}
export interface UserChannelUpdateInput {
  role?: "OWNER" | "MEMBER";
  coreUser?: { id: EntityId };
  channel?: { id: EntityId };
}
