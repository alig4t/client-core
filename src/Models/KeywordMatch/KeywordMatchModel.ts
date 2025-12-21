import type { BaseModel } from "@/core/models/BaseModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { UserModel } from "../User/UserModel";

export interface KeywordMatchModel extends BaseModel {
  matchedAt: string;
  message: MessagingPlatformModel;
  keyword: KeywordModel;
  coreUser: UserModel;
}
