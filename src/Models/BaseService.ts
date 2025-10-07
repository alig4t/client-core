// services/BaseService.ts

import { api } from '@/lib/axios';
import type { AxiosResponse } from 'axios';
import type { BaseResponse } from './BaseResponse';

// A generic type for paged responses from your Spring backend
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Current page number (0-indexed)
  size: number;
}

// A type for the parameters we'll send to the server
export interface ServerSideParams {
  page?: number;
  size?: number;
  sort?: string; // e.g., "name,asc"
  filters?: Record<string, any>; // e.g., { "name_like": "test" }
}

export class BaseService<T> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  // Update getAll to accept params
  getAll(params: ServerSideParams = {}): Promise<AxiosResponse<PagedResponse<T>>> {
    const queryParams = new URLSearchParams();

    // Append pagination
    queryParams.append('page', String(params.page ?? 0));
    queryParams.append('size', String(params.size ?? 10));

    // Append sorting
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    // Append filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    return api.get(`${this.url}?${queryParams.toString()}`);
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