import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
PersonCreateInput,
PersonModel,
PersonUpdateInput,
} from "./generated/PersonModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<PersonModel, PersonCreateInput, PersonUpdateInput>,
    "definition"
  >
> = {};
