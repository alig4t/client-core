import type { PermissionModel } from "./Permission/PermissionModel";
import type { PersonModel } from "./Person/PersonModel";
import type { PostModel } from "./Post/PostModel";
import type { RoleModel } from "./Role/RoleModel";
import type { TagModel } from "./Tag/TagModel";
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

type PersonResponse = BaseResponse<PersonModel>;
type TagResponse = BaseResponse<TagModel>;
type PostResponse = BaseResponse<PostModel>;
type RoleResponse = BaseResponse<RoleModel>;
type PermissionResponse = BaseResponse<PermissionModel>;
type UserWithTokenResponse = BaseResponse<UserResponse>;