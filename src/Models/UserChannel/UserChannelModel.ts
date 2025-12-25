import type { BaseModel } from "@/core/models/BaseModel";
import type { UserModel } from "@/Models/User/UserModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";

import type { UserChannelRoleEnum } from "./UserChannelRoleEnum";

export interface UserChannelModel extends BaseModel {
  role: UserChannelRoleEnum;
  coreUser: UserModel;
  channel: ChannelModel;
}
