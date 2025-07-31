// services/BaseService.ts
import { api } from '@/lib/axios';
import type { AxiosResponse } from 'axios';
import type { BaseResponse } from '@/Models/BaseResponse';

export class BaseService<T> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  getAll(): Promise<AxiosResponse<BaseResponse<T[]>>> {
    return api.get(this.url);
  }

  getById(id: number): Promise<AxiosResponse<BaseResponse<T>>> {
    return api.get(`${this.url}/${id}`);
  }

  create(data: Partial<T>): Promise<AxiosResponse<BaseResponse<T>>> {
    return api.post(this.url, data);
  }

  update(id: number, data: Partial<T>): Promise<AxiosResponse<BaseResponse<T>>> {
    return api.put(`${this.url}/${id}`, data);
  }

  delete(id: number): Promise<AxiosResponse<void>> {
    return api.delete(`${this.url}/${id}`);
  }
}
