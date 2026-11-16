import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
MessagingPlatformCreateInput,
MessagingPlatformModel,
MessagingPlatformUpdateInput,
} from "./generated/MessagingPlatformModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<
      MessagingPlatformModel,
      MessagingPlatformCreateInput,
      MessagingPlatformUpdateInput
    >,
    "definition"
  >
> = {};
