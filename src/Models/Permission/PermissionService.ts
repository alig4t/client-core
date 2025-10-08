// services/PermissionService.ts
import { BaseService } from '@/Models/BaseService';
import type { PermissionModel } from '@/Models/Permission/PermissionModel';

class PermissionService extends BaseService<PermissionModel> {
  constructor() {
    super('/permission');
  }
}

export default new PermissionService();
