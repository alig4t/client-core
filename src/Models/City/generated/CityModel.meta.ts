import { createModelMeta } from "@/core/models/modelMetaUtils";
import { CityDefinition } from "./City.definition";
export const CityModelMeta = {
  ...createModelMeta(CityDefinition.fields, "cityName", "شهر", "شهرها"),
  definition: CityDefinition,
  displayField: "cityName" as const,
};
