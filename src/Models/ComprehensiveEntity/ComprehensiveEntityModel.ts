import type { BaseModel } from "@/core/models/BaseModel";
import type { UserModel } from "@/Models/User/UserModel";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { MessagingPlatformModel } from "@/Models/MessagingPlatform/MessagingPlatformModel";
import type { AttachmentModel } from "@/Models/Attachment/AttachmentModel";

import type { ComprehensiveEntityEnumFieldEnum } from "./ComprehensiveEntityEnumFieldEnum";

export interface ComprehensiveEntityModel extends BaseModel {
  stringField: string;
  integerField?: number;
  longField?: number;
  doubleField?: number;
  bigDecimalField?: number;
  booleanField?: boolean;
  dateField?: string;
  localDateField?: string;
  localDateTimeField?: string;
  enumField?: ComprehensiveEntityEnumFieldEnum;
  uniqueField: string;
  indexedField?: string;
  oneToOneUser: UserModel;
  manyToOneChannel: ChannelModel;
  oneToManyKeywords?: KeywordModel[];
  manyToManyMessages?: MessagingPlatformModel[];
  attachments?: AttachmentModel[];
}
