import { createModelMeta } from "@/core/models/modelMetaUtils";
import { KeywordMatchDefinition } from "./KeywordMatch.definition";
export const KeywordMatchModelMeta = {
  ...createModelMeta(
    KeywordMatchDefinition.fields,
    "matchedAt",
    "تطابق کلمه کلیدی",
    "تطابق‌های کلمه کلیدی",
  ),
  definition: KeywordMatchDefinition,
  displayField: "matchedAt" as const,
};
