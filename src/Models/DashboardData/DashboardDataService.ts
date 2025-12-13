import { BaseService } from "@/core/service/BaseService";
import type { DashboardDataModel } from "./DashboardDataModel";

class DashboardDataServiceClass extends BaseService<DashboardDataModel> {
  constructor() {
    super("/dashboarddata");
  }
}

const DashboardDataService = new DashboardDataServiceClass();

export default DashboardDataService;
export { DashboardDataService };
