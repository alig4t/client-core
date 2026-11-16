import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
CityCreateInput,
CityModel,
CityUpdateInput,
} from "./generated/CityModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<CityModel, CityCreateInput, CityUpdateInput>,
    "definition"
  >
> = {};
