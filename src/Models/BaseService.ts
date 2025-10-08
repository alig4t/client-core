import { api } from "@/lib/axios";

// This interface is what your UI components expect. It will not change.
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// Interface for parameters sent to the server
export interface ServerSideParams {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, any>;
}

export class BaseService<T> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getAll(params: ServerSideParams = {}): Promise<PagedResponse<T>> {
    const queryParams = new URLSearchParams();
    // We send pagination params regardless, the server can ignore them if not applicable.
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

    const response: any = await api.get(`${this.url}?${queryParams.toString()}`);

    // ✨ THIS IS THE ROBUST, FINAL LOGIC ✨
    // We check the structure of the response to decide how to handle it.

    // Case 1: The response is an object with pagination metadata (Server-Side Pagination)
    if (response && response.meta && Array.isArray(response.data)) {
      console.log("Handling response with SERVER-SIDE pagination.");
      return {
        content: response.data,
        totalPages: response.meta.totalPages,
        totalElements: response.meta.totalItems,
        number: response.meta.currentPage,
        size: response.meta.pageSize,
      };
    }

    // Case 2: The response is just a plain array (Fallback to Client-Side Pagination)
    if (Array.isArray(response)) {
      console.warn(`Warning: API endpoint ${this.url} returned an array without pagination metadata. Falling back to CLIENT-SIDE pagination.`);
      
      const page = params.page ?? 0;
      const size = params.size ?? 10;
      const totalElements = response.length;
      const totalPages = Math.ceil(totalElements / size);
      const paginatedContent = response.slice(page * size, (page + 1) * size);

      return {
        content: paginatedContent,
        totalPages: totalPages,
        totalElements: totalElements,
        number: page,
        size: size,
      };
    }

    // Fallback for any other unexpected structure
    console.error("Error: Unexpected API response structure.", response);
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      number: 0,
      size: params.size ?? 10,
    };
  }

  // --- Other methods remain unchanged and will work correctly ---
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