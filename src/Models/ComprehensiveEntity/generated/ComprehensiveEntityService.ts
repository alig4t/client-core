import { BaseService } from "@/core/service/BaseService";
import type {
  ComprehensiveEntityModel,
  ComprehensiveEntityCreateInput,
  ComprehensiveEntityUpdateInput,
} from "./ComprehensiveEntityModel";
import { ComprehensiveEntityDefinition } from "./ComprehensiveEntity.definition";
const service = new BaseService<
  ComprehensiveEntityModel,
  ComprehensiveEntityCreateInput,
  ComprehensiveEntityUpdateInput
>("/comprehensiveentity", undefined, {
  operations: ComprehensiveEntityDefinition.operations,
});
export default service;
