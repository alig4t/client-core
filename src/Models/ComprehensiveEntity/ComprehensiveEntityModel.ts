import type { BaseModel } from "@/core/models/BaseModel";
import type { User } from "@/core/models/User";
import type { ChannelModel } from "@/Models/Channel/ChannelModel";
import type { KeywordModel } from "@/Models/Keyword/KeywordModel";
import type { Message } from "";
import type { Document } from "@/core/models/Document";

import type { ComprehensiveEntityEnumFieldEnum } from "./ComprehensiveEntityEnumFieldEnum";

export interface ComprehensiveEntityModel extends BaseModel {
  stringField: string;
  integerField?: number;
  longField?: number;
  doubleField?: number;
  bigDecimalField?: string;
  booleanField?: boolean;
  dateField?: string;
  localDateField?: string;
  localDateTimeField?: string;
  enumField?: ComprehensiveEntityEnumFieldEnum;
  uniqueField: string;
  indexedField?: string;
  oneToOneUser: User;
  manyToOneChannel: ChannelModel;
  oneToManyKeywords?: KeywordModel[];
  manyToManyMessages?: Message[];
  attachments?: Document[];
}
