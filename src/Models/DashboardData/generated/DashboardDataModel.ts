import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { UserModel } from "@/Models/User/UserModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
export interface DashboardDataModel extends BaseModel<number> {
  frequencyCount: number;
  lastMatchedAt: string;
  coreUser: UserModel;
  keyword: KeywordModel;
  channel: ChannelModel;
}
export interface DashboardDataCreateInput {
  frequencyCount: number;
  lastMatchedAt: string;
  coreUser: { id: EntityId };
  keyword: { id: EntityId };
  channel: { id: EntityId };
}
export interface DashboardDataUpdateInput {
  frequencyCount?: number;
  lastMatchedAt?: string;
  coreUser?: { id: EntityId };
  keyword?: { id: EntityId };
  channel?: { id: EntityId };
}
