import { createModelMeta } from "@/core/models/modelMetaUtils";
import { MessageDefinition } from "./Message.definition";
export const MessageModelMeta = {
  ...createModelMeta(
    MessageDefinition.fields,
    "platformMessageId",
    "پیام",
    "پیام‌ها",
  ),
  definition: MessageDefinition,
  displayField: "platformMessageId" as const,
};
