// services/PermissionService.ts
import { BaseService } from '@/core/service/BaseService';
import type { PermissionModel } from '@/Models/Permission/PermissionModel';

class PermissionService extends BaseService<PermissionModel> {
  constructor() {
    super('/permission');
  }
}

export default new PermissionService();
