import { createModelMeta } from "@/core/models/modelMetaUtils";
import { DashboardDataDefinition } from "./DashboardData.definition";
export const DashboardDataModelMeta = {
  ...createModelMeta(
    DashboardDataDefinition.fields,
    "frequencyCount",
    "داده داشبورد",
    "داده‌های داشبورد",
  ),
  definition: DashboardDataDefinition,
  displayField: "frequencyCount" as const,
};
