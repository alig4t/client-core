// services/DocumentService.ts
import { api } from '@/core/service/Axios';
import type { ApiResponse } from '@/core/service/Axios';
import type { AttachmentModel } from './AttachmentModel';
import { BaseService } from '@/core/service/BaseService';

class AttachmentService extends BaseService<AttachmentModel> {

  constructor() {
    super("/attachment");
  }

  async upload(file: File): Promise<AttachmentModel> {
    const formData = new FormData();
    formData.append('file', file);


    const response = await api.post<AttachmentModel>(
      '/document/upload',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    return response.data; // ✅ Direct data
  }

  async getToken(id: number): Promise<string> {
    const response = await api.get<string>(`/document/token/${id}`);
    return response.data;
  }

  // ✅ Download image with axios + responseType: 'blob'
  async downloadAsBlob(token: string): Promise<Blob> {
    const response = await api.get(`/document/stream/${token}`, {
      responseType: 'blob',
    });
    console.log(response.data instanceof Blob)
    console.log('Download response:', response);

    return response.data; // Now it's really a Blob
  }

}

export default new AttachmentService();