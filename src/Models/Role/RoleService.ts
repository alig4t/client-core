import { BaseService } from "@/core/service/BaseService";
import type { RoleModel } from "./RoleModel";

class RoleService extends BaseService<RoleModel> {
  constructor() {
    super("/role");
  }
}

export default new RoleService();
