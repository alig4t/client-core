import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { UserModel } from "@/Models/User/UserModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
export interface KeywordModel extends BaseModel<number> {
  keywordText: string;
  coreUser: UserModel;
  channel: ChannelModel;
  messages?: MessagingPlatformModel[];
}
export interface KeywordCreateInput {
  keywordText: string;
  coreUser: { id: EntityId };
  channel: { id: EntityId };
  messages?: { id: EntityId }[];
}
export interface KeywordUpdateInput {
  keywordText?: string;
  coreUser?: { id: EntityId };
  channel?: { id: EntityId };
  messages?: { id: EntityId }[];
}
