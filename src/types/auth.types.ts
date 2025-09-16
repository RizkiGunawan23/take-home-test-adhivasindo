/* eslint-disable perfectionist/sort-object-types */

import type { Request } from "express";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export interface AuthTypedRequest<T = unknown> extends Request {
    body: T;
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export interface LoginData {
    email: string;
    password: string;
}

export interface TypedRequest<T = unknown> extends Request {
    body: T;
}
