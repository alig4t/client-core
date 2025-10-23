// services/DocumentService.ts
import { api } from '@/lib/axios';
import type { ApiResponse } from '@/lib/axios';
import type { DocumentModel } from './DocumentModel';

class DocumentService {
  async upload(file: File): Promise<DocumentModel> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<DocumentModel>>('/document/upload', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    return response.data.data; // ✅ DocumentModel
  }

  async getToken(id: number): Promise<string> {
    const response = await api.get<ApiResponse<string>>(`/document/token/${id}`);
    return response.data.data; // ✅ string
  }

  getDownloadUrl(token: string): string {
    return `${import.meta.env.VITE_API_BASE_URL}/document/stream/${token}`;
  }

  async downloadAsBlob(token: string): Promise<Blob> {
    const url = this.getDownloadUrl(token);
    const tokenValue = localStorage.getItem('token');
    const res = await fetch(url, {
      headers: tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {},
    });
    if (!res.ok) throw new Error('Download failed');
    return res.blob();
  }
}

export default new DocumentService();