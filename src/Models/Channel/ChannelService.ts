// services/ComprehensiveService.ts
import { BaseService } from '@/core/service/BaseService';
import type { ChannelModel } from './ChannelModel';

class ChannelService extends BaseService<ChannelModel> {
  constructor() {
    super('/channel');
  }
}

export default new ChannelService();
