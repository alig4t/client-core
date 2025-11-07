// services/ComprehensiveService.ts
import { BaseService } from '@/core/service/BaseService';
import type { ComprehensiveModel } from '@/Models/Comprehensive/ComprehensiveModel';

class ComprehensiveService extends BaseService<ComprehensiveModel> {
  constructor() {
    super('/comprehensiveentity');
  }
}

export default new ComprehensiveService();
