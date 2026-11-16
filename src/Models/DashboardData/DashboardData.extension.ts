import type { EntityDefinitionOverrides,EntityPageProps } from "@/core/entity";
import type {
DashboardDataCreateInput,
DashboardDataModel,
DashboardDataUpdateInput,
} from "./generated/DashboardDataModel";
export const definitionOverrides: EntityDefinitionOverrides = {};
export const entityExtension: Partial<
  Omit<
    EntityPageProps<
      DashboardDataModel,
      DashboardDataCreateInput,
      DashboardDataUpdateInput
    >,
    "definition"
  >
> = {};
