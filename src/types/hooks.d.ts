import React from "react";

declare type AuthMiddleware = 'auth' | 'guest'

export interface IUseAuth {
    middleware: AuthMiddleware;
    redirectIfAuthenticated?: string;
}

export interface IApiRequest {
    setErrors?: React.Dispatch<React.SetStateAction<never[]>>;
    [key: string]: any;
}
