import { BaseService } from "@/core/service/BaseService";
import type {
  PersonModel,
  PersonCreateInput,
  PersonUpdateInput,
} from "./PersonModel";
import { PersonDefinition } from "./Person.definition";
const service = new BaseService<
  PersonModel,
  PersonCreateInput,
  PersonUpdateInput
>("/person", undefined, { operations: PersonDefinition.operations });
export default service;
