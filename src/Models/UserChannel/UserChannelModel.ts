import type { BaseModel } from "@/core/models/BaseModel";
import type { User } from "@/core/models/User";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";

import type { UserChannelRoleEnum } from "./UserChannelRoleEnum";

export interface UserChannelModel extends BaseModel {
  role: UserChannelRoleEnum;
  coreUser: User;
  channel: ChannelModel;
}
