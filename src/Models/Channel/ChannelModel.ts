import type { BaseModel } from "@/core/models/BaseModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
import type { BotModel } from "@/Models/Bot/BotModel";

import type { ChannelStatusEnum } from "./ChannelStatusEnum";

export interface ChannelModel extends BaseModel {
  channelName: string;
  channelIdentifier: string;
  status: ChannelStatusEnum;
  platform: MessagingPlatformModel;
  bots?: BotModel[];
}
