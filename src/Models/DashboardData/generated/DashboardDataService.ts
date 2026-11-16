import { BaseService } from "@/core/service/BaseService";
import type {
  DashboardDataModel,
  DashboardDataCreateInput,
  DashboardDataUpdateInput,
} from "./DashboardDataModel";
import { DashboardDataDefinition } from "./DashboardData.definition";
const service = new BaseService<
  DashboardDataModel,
  DashboardDataCreateInput,
  DashboardDataUpdateInput
>("/dashboarddata", undefined, {
  operations: DashboardDataDefinition.operations,
});
export default service;
