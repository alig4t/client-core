import { api } from "@/lib/axios";

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
  meta: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export class BaseService<T> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getAll(params: ServerSideParams = {}): Promise<PagedResponse<T>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params.page ?? 0));
    queryParams.append('size', String(params.size ?? 10));
    if (params.sort) queryParams.append('sort', params.sort);

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    // The interceptor doesn't run on the type level, so we expect an AxiosResponse here
    const response = await api.get<ApiResponsePayload<T>>(`${this.url}?${queryParams.toString()}`);

    // ✨ **The Fix is Here** ✨
    // We access the properties from `response.data` which contains our payload
    return {
      content:       response.data.data,
      totalPages:    response.data.meta.totalPages,
      totalElements: response.data.meta.totalItems,
      number:        response.data.meta.currentPage,
      size:          response.data.meta.pageSize,
    };
  }

  getById(id: number): Promise<T> {
    return api.get(`${this.url}/${id}`);
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