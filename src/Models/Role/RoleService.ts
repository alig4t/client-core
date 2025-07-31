// services/RoleService.ts
import { BaseService } from '@/Models/BaseService';
import type { RoleModel } from '@/Models/Role/RoleModel';

class RoleService extends BaseService<RoleModel> {
  constructor() {
    super('/roles');
  }
}

export default new RoleService();
