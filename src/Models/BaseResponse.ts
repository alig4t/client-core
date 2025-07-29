import type { UserModel } from "./User/UserModel";

export interface BaseResponse<T> {
    type: string;
    status: number;
    data: T;
    meta: Record<string, unknown>;
    timestamp: string;
}

interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

export interface UserResponse {
    token: string;
    user: UserModel;
}