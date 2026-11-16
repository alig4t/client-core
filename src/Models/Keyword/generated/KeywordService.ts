import { BaseService } from "@/core/service/BaseService";
import type {
  KeywordModel,
  KeywordCreateInput,
  KeywordUpdateInput,
} from "./KeywordModel";
import { KeywordDefinition } from "./Keyword.definition";
const service = new BaseService<
  KeywordModel,
  KeywordCreateInput,
  KeywordUpdateInput
>("/keyword", undefined, { operations: KeywordDefinition.operations });
export default service;
