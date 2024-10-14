import axios, {AxiosError, AxiosResponse} from "axios";
import {ApiInstance} from "../../types/http-service/custom-axios";
import {AppResponse} from "../../types/http-service/response";
// import * as Bowser from 'bowser';
import Bowser from 'bowser';
import ServiceUtils from "./ServiceUtils.ts";
import {message} from "antd";

class ApiService {

    private static instance: ApiService;
    private readonly api: ApiInstance;

    private constructor() {
        this.api = axios.create();
        this.setupInterceptors();
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public getApi(): ApiInstance {
        return this.api;
    }

    private setupInterceptors(): void {
        this.api.interceptors.request.use((config: any) => {
            let accessToken: null | string;
            const defaultHeaders = {
                'Content-Type': undefined,
                'User-Agent': undefined,
                'Content-Encoding': undefined,
                Authorization: undefined,
                'Content-Length': undefined,
                Accept: undefined,
                'X-Requested-With': 'XMLHttpRequest',
            };

            accessToken = ServiceUtils.getAccessToken();
            const browser: Bowser.Parser.ParsedResult = Bowser.parse(window.navigator.userAgent);
            config.headers = {
                ...defaultHeaders,
                ...(config.headers),
                source: "web",
                platform: `${browser.browser.name} ${browser.browser.version} ${browser.os.name} ${browser.platform.type}`
            };

            config = {
                ...config,
                withCredentials: true,
                withXSRFToken: true
            }

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        this.api.interceptors.response.use(
            (response: AxiosResponse<AppResponse>) => {
                if (!response.data) {
                    console.warn('Empty Response Received.');
                }
                switch (response.status) {
                    case 0:
                        console.warn('Error, Please check logs.');
                        break;
                    case 200:
                    case 201:
                        break;
                    default:
                        console.warn(JSON.parse(response.data.toString() || "{}"));
                }
                return response;
            },
            (error: AxiosError<any>) => {
                switch (error.response?.status) {
                    case 0:
                        message.warning('Error, Please check logs.');
                        break;
                    case 500:
                        message.error('An internal server error occurred.');
                        break;
                    case 403:
                        message.error('You are not allowed to perform this action! Forbidden.');
                        break;
                    case 401:
                        message.error('You are not allowed to perform this action! Unauthorized.');
                        break;
                    case 400:
                        message.error('Bad Request');
                        break;
                    case 422: {
                        const message = 'message' in error.response?.data ? error.response?.data.message : error.response?.data;
                        message.error(message);
                        break;
                    }
                    default: {
                        if (error.code !== "ERR_CANCELED") message.error(error.message);
                        console.error(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

}

export default ApiService;
