export interface User {
    id: number;
    name: string;
    email: string;
}


export interface Auth {
    user: User;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
