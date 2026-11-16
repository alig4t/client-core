import { createModelMeta } from "@/core/models/modelMetaUtils";
import { KeywordDefinition } from "./Keyword.definition";
export const KeywordModelMeta = {
  ...createModelMeta(
    KeywordDefinition.fields,
    "keywordText",
    "کلمه کلیدی",
    "کلمات کلیدی",
  ),
  definition: KeywordDefinition,
  displayField: "keywordText" as const,
};
