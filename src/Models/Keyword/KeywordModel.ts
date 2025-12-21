import type { BaseModel } from "@/core/models/BaseModel";
import type { User } from "@/core/models/User";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";

export interface KeywordModel extends BaseModel {
  keywordText: string;
  coreUser: User;
  channel: ChannelModel;
  messages?: MessagingPlatformModel[];
}
