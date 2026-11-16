import { BaseService } from "@/core/service/BaseService";
import type {
  KeywordMatchModel,
  KeywordMatchCreateInput,
  KeywordMatchUpdateInput,
} from "./KeywordMatchModel";
import { KeywordMatchDefinition } from "./KeywordMatch.definition";
const service = new BaseService<
  KeywordMatchModel,
  KeywordMatchCreateInput,
  KeywordMatchUpdateInput
>("/keywordmatch", undefined, {
  operations: KeywordMatchDefinition.operations,
});
export default service;
