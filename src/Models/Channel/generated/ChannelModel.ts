import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
import type { BotModel } from "@/Models/Bot/BotModel";
export interface ChannelModel extends BaseModel<number> {
  channelName: string;
  channelIdentifier: string;
  status: "ACTIVE" | "INACTIVE";
  platform: MessagingPlatformModel;
  bots?: BotModel[];
}
export interface ChannelCreateInput {
  channelName: string;
  channelIdentifier: string;
  status: "ACTIVE" | "INACTIVE";
  platform: { id: EntityId };
  bots?: { id: EntityId }[];
}
export interface ChannelUpdateInput {
  channelName?: string;
  channelIdentifier?: string;
  status?: "ACTIVE" | "INACTIVE";
  platform?: { id: EntityId };
  bots?: { id: EntityId }[];
}
