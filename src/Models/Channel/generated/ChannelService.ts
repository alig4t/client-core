import { BaseService } from "@/core/service/BaseService";
import type {
  ChannelModel,
  ChannelCreateInput,
  ChannelUpdateInput,
} from "./ChannelModel";
import { ChannelDefinition } from "./Channel.definition";
const service = new BaseService<
  ChannelModel,
  ChannelCreateInput,
  ChannelUpdateInput
>("/channel", undefined, { operations: ChannelDefinition.operations });
export default service;
