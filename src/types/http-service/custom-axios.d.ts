import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfigs extends InternalAxiosRequestConfig {
    headers?: {
        Authorization?: string | null;
        'x-access-token'?: string | null;
        'Content-Type'?: string;
        'User-Agent'?: string;
        'Content-Encoding'?: string;
        'Content-Length'?: string;
        Accept?: string;
        source?: string;
        platform?: string;
    };
}

export type ApiInstance = AxiosInstance;

export type CustomAxiosRequestConfig = CustomAxiosRequestConfigs;
