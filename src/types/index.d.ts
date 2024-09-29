export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: string;
    password: string;
    passwordConfirmation: string;
    photo?: File | null | undefined;
}

export interface UpdateUserData {
    name: string;
    email: string;
    phone: string;
    address?: string;
    photo?: File | null;
}

export interface Auth {
    user: User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
