import type { BaseModel } from "@/core/models/BaseModel";
import type { UserModel } from "@/Models/User/UserModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";

export interface DashboardDataModel extends BaseModel {
  frequencyCount: number;
  lastMatchedAt: string;
  coreUser: UserModel;
  keyword: KeywordModel;
  channel: ChannelModel;
}
