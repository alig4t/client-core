// services/DocumentService.ts
import { api } from '@/lib/axios';
import type { ApiResponse } from '@/lib/axios';
import type { DocumentModel } from './DocumentModel';

class DocumentService {
  async upload(file: File): Promise<DocumentModel> {
    const formData = new FormData();
    formData.append('file', file);


    const response = await api.post<DocumentModel>(
      '/document/upload',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    return response.data; // ✅ مستقیم data
  }

  async getToken(id: number): Promise<string> {
    const response = await api.get<string>(`/document/token/${id}`);
    return response.data;
  }

  // ✅ دانلود تصویر با axios + responseType: 'blob'
  async downloadAsBlob(token: string): Promise<Blob> {
    const response = await api.get(`/document/stream/${token}`, {
      responseType: 'blob',
    });
    console.log(response.data instanceof Blob)
    console.log('Download response:', response);

    return response.data; // حالا واقعاً یک Blob است
  }

}

export default new DocumentService();