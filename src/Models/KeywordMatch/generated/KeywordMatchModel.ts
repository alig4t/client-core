import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { UserModel } from "@/Models/User/UserModel";
export interface KeywordMatchModel extends BaseModel<number> {
  matchedAt: string;
  messagingPlatform: MessagingPlatformModel;
  keyword: KeywordModel;
  coreUser: UserModel;
}
export interface KeywordMatchCreateInput {
  matchedAt: string;
  messagingPlatform: { id: EntityId };
  keyword: { id: EntityId };
  coreUser: { id: EntityId };
}
export interface KeywordMatchUpdateInput {
  matchedAt?: string;
  messagingPlatform?: { id: EntityId };
  keyword?: { id: EntityId };
  coreUser?: { id: EntityId };
}
