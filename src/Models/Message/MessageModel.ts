import type { BaseModel } from "@/core/models/BaseModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { Document } from "@/core/models/Document";

export interface MessageModel extends BaseModel {
  platformMessageId: string;
  text?: string;
  sentAt: string;
  senderId?: string;
  senderUsername?: string;
  channel: ChannelModel;
  keywords?: KeywordModel[];
  attachments?: Document[];
}
