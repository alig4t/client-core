import type { BaseModel } from "@/core/models/BaseModel";
import type { Message } from "";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { User } from "@/core/models/User";

export interface KeywordMatchModel extends BaseModel {
  matchedAt: string;
  message: Message;
  keyword: KeywordModel;
  coreUser: User;
}
