import { BaseService } from '@/core/service/BaseService';
import type { PlatformModel } from '@/Models/Platform/PlatformModel';

class PlatformService extends BaseService<PlatformModel> {
  constructor() {
    super('/messagingplatform');
  }
}

export default new PlatformService();