import { BaseService } from "@/core/service/BaseService";
import type {
  UserChannelModel,
  UserChannelCreateInput,
  UserChannelUpdateInput,
} from "./UserChannelModel";
import { UserChannelDefinition } from "./UserChannel.definition";
const service = new BaseService<
  UserChannelModel,
  UserChannelCreateInput,
  UserChannelUpdateInput
>("/userchannel", undefined, { operations: UserChannelDefinition.operations });
export default service;
