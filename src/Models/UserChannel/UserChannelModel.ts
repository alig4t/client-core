import type { BaseModel } from "@/core/models/BaseModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";

import type { UserChannelRoleEnum } from "./UserChannelRoleEnum";
import type { UserModel } from "../User/UserModel";

export interface UserChannelModel extends BaseModel {
  role: UserChannelRoleEnum;
  coreUser: UserModel;
  channel: ChannelModel;
}
