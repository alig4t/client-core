import { createModelMeta } from "@/core/models/modelMetaUtils";
import { MessagingPlatformDefinition } from "./MessagingPlatform.definition";
export const MessagingPlatformModelMeta = {
  ...createModelMeta(
    MessagingPlatformDefinition.fields,
    "platformName",
    "پلتفرم پیام‌رسانی",
    "پلتفرم‌های پیام‌رسانی",
  ),
  definition: MessagingPlatformDefinition,
  displayField: "platformName" as const,
};
