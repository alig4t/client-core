import type { BaseModel } from "@/core/models/BaseModel";
import type { OwnedChannelStatusEnum } from "./OwnedChannelStatusEnum";

export interface OwnedChannelModel extends BaseModel {
  platformKey: string;
  provisionalIdentifier: string;
  displayName: string;
  channelId: number;
  channelTitle: string;
  platformName: string;
  ownerId: number;
  ownerName: string;
  status: OwnedChannelStatusEnum;
}
