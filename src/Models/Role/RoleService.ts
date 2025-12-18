// services/RoleService.ts
import { BaseService } from '@/core/service/BaseService';
import type { RoleModel } from '@/Models/Role/RoleModel';

class RoleService extends BaseService<RoleModel> {
  constructor() {
    super('/role');
  }
}

export default new RoleService();
