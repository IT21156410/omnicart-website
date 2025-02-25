import {AxiosResponse} from "axios";

export interface AppResponse<T = unknown> {
    success: boolean;
    data: T;
    message: string;
    error?: string;
    errorCode?: number;
    errorData?: unknown;
}

export type AxiosAppResponse<T> = AxiosResponse<AppResponse<T>>
