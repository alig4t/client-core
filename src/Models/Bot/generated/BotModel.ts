import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
export interface BotModel extends BaseModel<number> {
  token: string;
  status: "ACTIVE" | "INACTIVE";
  platform: MessagingPlatformModel;
}
export interface BotCreateInput {
  token: string;
  status: "ACTIVE" | "INACTIVE";
  platform: { id: EntityId };
}
export interface BotUpdateInput {
  token?: string;
  status?: "ACTIVE" | "INACTIVE";
  platform?: { id: EntityId };
}
