import type { BaseModel } from "@/core/models/BaseModel";
import type { EntityId } from "@/core/service/contracts";
import type { UserModel } from "@/Models/User/UserModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
import type { AttachmentModel } from "@/Models/Attachment/AttachmentModel";
export interface ComprehensiveEntityModel extends BaseModel<number> {
  stringField: string;
  integerField?: number;
  longField?: string;
  doubleField?: number;
  bigDecimalField?: string;
  booleanField?: boolean;
  dateField?: string;
  localDateField?: string;
  localDateTimeField?: string;
  enumField?: "OPTION_A" | "OPTION_B";
  uniqueField: string;
  indexedField?: string;
  oneToOneUser: UserModel;
  manyToOneChannel: ChannelModel;
  oneToManyKeywords?: KeywordModel[];
  manyToManyMessages?: MessagingPlatformModel[];
  attachments?: AttachmentModel[];
}
export interface ComprehensiveEntityCreateInput {
  stringField: string;
  integerField?: number;
  longField?: string;
  doubleField?: number;
  bigDecimalField?: string;
  booleanField?: boolean;
  dateField?: string;
  localDateField?: string;
  localDateTimeField?: string;
  enumField?: "OPTION_A" | "OPTION_B";
  uniqueField: string;
  indexedField?: string;
  oneToOneUser: { id: EntityId };
  manyToOneChannel: { id: EntityId };
  oneToManyKeywords?: { id: EntityId }[];
  manyToManyMessages?: { id: EntityId }[];
  attachments?: { id: EntityId }[];
}
export interface ComprehensiveEntityUpdateInput {
  stringField?: string;
  integerField?: number;
  longField?: string;
  doubleField?: number;
  bigDecimalField?: string;
  booleanField?: boolean;
  dateField?: string;
  localDateField?: string;
  localDateTimeField?: string;
  enumField?: "OPTION_A" | "OPTION_B";
  uniqueField?: string;
  indexedField?: string;
  oneToOneUser?: { id: EntityId };
  manyToOneChannel?: { id: EntityId };
  oneToManyKeywords?: { id: EntityId }[];
  manyToManyMessages?: { id: EntityId }[];
  attachments?: { id: EntityId }[];
}
