// services/ComprehensiveService.ts
import { BaseService } from '@/Models/BaseService';
import type { ComprehensiveModel } from '@/Models/Comprehensive/ComprehensiveModel';

class ComprehensiveService extends BaseService<ComprehensiveModel> {
  constructor() {
    super('/comprehensiveentity');
  }
}

export default new ComprehensiveService();
