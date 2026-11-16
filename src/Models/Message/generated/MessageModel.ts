import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { AttachmentModel } from "@/Models/Attachment/AttachmentModel";
export interface MessageModel extends BaseModel<number> {
  platformMessageId: string;
  text?: string;
  sentAt: string;
  senderId?: string;
  senderUsername?: string;
  channel: ChannelModel;
  keywords?: KeywordModel[];
  attachments?: AttachmentModel[];
}
export interface MessageCreateInput {
  platformMessageId: string;
  text?: string;
  sentAt: string;
  senderId?: string;
  senderUsername?: string;
  channel: { id: EntityId };
  keywords?: { id: EntityId }[];
  attachments?: { id: EntityId }[];
}
export interface MessageUpdateInput {
  platformMessageId?: string;
  text?: string;
  sentAt?: string;
  senderId?: string;
  senderUsername?: string;
  channel?: { id: EntityId };
  keywords?: { id: EntityId }[];
  attachments?: { id: EntityId }[];
}
