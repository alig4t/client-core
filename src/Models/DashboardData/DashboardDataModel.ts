import type { BaseModel } from "@/core/models/BaseModel";
import type { User } from "@/core/models/User";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";

export interface DashboardDataModel extends BaseModel {
  frequencyCount: number;
  lastMatchedAt: string;
  coreUser: User;
  keyword: KeywordModel;
  channel: ChannelModel;
}
