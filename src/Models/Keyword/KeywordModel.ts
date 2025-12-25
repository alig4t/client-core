import type { BaseModel } from "@/core/models/BaseModel";
import type { UserModel } from "@/Models/User/UserModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";

export interface KeywordModel extends BaseModel {
  keywordText: string;
  coreUser: UserModel;
  channel: ChannelModel;
  messages?: MessagingPlatformModel[];
}
