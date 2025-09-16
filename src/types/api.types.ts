/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable perfectionist/sort-interfaces */

export interface ApiResponse<T = unknown> {
    message?: string;
    errors?: Record<string, string[]>;
    data?: T;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface CreateUserResponse {
    id: string;
    email: string;
    name: null | string;
    role: string;
}

export interface ErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

export type FieldErrors = Record<string, string[]>;

export interface LoginResponse {
    tokens: AuthTokens;
    user: {
        id: string;
        email: string;
        name: null | string;
        role: string;
    };
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface RefreshTokenResponse {
    tokens: AuthTokens;
}

export interface SuccessResponse<T = unknown> {
    message?: string;
    data?: T;
}

export interface UserListItem {
    id: string;
    email: string;
    name: null | string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserListResponse {
    users: UserListItem[];
    pagination: PaginationMeta;
}

export interface UserResponse {
    id: string;
    email: string;
    name: null | string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface ValidationError {
    message: string;
    field: string;
}
