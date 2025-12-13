import type { BaseModel } from "@/core/models/BaseModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";

import type { BotStatusEnum } from "./BotStatusEnum";

export interface BotModel extends BaseModel {
  token: string;
  status: BotStatusEnum;
  platform: MessagingPlatformModel;
}
