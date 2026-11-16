import { BaseService } from "@/core/service/BaseService";
import type { CityModel, CityCreateInput, CityUpdateInput } from "./CityModel";
import { CityDefinition } from "./City.definition";
const service = new BaseService<CityModel, CityCreateInput, CityUpdateInput>(
  "/city",
  undefined,
  { operations: CityDefinition.operations },
);
export default service;
