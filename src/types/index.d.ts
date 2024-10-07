import {Role} from "../enums/auth.ts";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
}

export interface CreateUserData {
    name: string;
    email: string;
    //phone: string;
    //address?: string;
    role: Role;
    password: string;
    //photo?: File | null | undefined;
}

export interface UpdateUserData {
    name: string;
    email: string;
    role: Role;
    //phone: string;
    //address?: string;
    //photo?: File | null;
}

export interface Auth {
    user: User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
