import { BaseService } from "@/core/service/BaseService";
import type { DashboardDataModel } from "./DashboardDataModel";

class DashboardDataService extends BaseService<DashboardDataModel> {
  constructor() {
    super("/dashboarddata");
  }
}

export default new DashboardDataService();
