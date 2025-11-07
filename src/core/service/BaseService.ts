import { api, type ApiResponse } from "@/core/service/Axios";

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface ServerSideParams {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, any>;
}

interface ApiResponsePayload<T> {
  data: T[];
  meta?: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    isLastPage?: boolean;
  };
}


export class BaseService<T> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getAll(params: ServerSideParams = {}): Promise<ApiResponsePayload<T>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params.page ?? 0));
    queryParams.append('size', String(params.size ?? 10));
 
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    if (params.sort) queryParams.append('sort', params.sort);
    
    // Cast the response to ApiResponse<T[]> to be explicit
    const response = await api.get(`${this.url}?${queryParams.toString()}`) as ApiResponse<T[]>;
    
    console.log('Full response:', response);
    
    if (!response.meta) {
      throw new Error('Pagination metadata missing in response');
    }

    console.log('Response data:', response.data);
    
    return {
      data: response.data,
      meta: {
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        currentPage: response.meta.currentPage,
        pageSize: response.meta.pageSize,
        isLastPage: response.meta.isLastPage,
      }
    };
  }
  async getById(id: number): Promise<T> {
    const apiService = await api.get(`${this.url}/${id}`);
    return apiService.data;
  }

  create(data: Partial<T>): Promise<T> {
    return api.post(this.url, data);
  }

  update(id: number, data: Partial<T>): Promise<T> {
    return api.put(`${this.url}/${id}`, data);
  }

  delete(id: number): Promise<void> {
    return api.delete(`${this.url}/${id}`);
  }
}