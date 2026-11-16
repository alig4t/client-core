import { createModelMeta } from "@/core/models/modelMetaUtils";
import { ComprehensiveEntityDefinition } from "./ComprehensiveEntity.definition";
export const ComprehensiveEntityModelMeta = {
  ...createModelMeta(
    ComprehensiveEntityDefinition.fields,
    "stringField",
    "ترکیبی",
    "ترکیبی‌ها",
  ),
  definition: ComprehensiveEntityDefinition,
  displayField: "stringField" as const,
};
