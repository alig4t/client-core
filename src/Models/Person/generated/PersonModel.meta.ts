import { createModelMeta } from "@/core/models/modelMetaUtils";
import { PersonDefinition } from "./Person.definition";
export const PersonModelMeta = {
  ...createModelMeta(PersonDefinition.fields, "firstName", "شخص", "اشخاص"),
  definition: PersonDefinition,
  displayField: "firstName" as const,
};
