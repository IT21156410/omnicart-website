import ApiService from "./api/ApiService.ts";
import {ApiInstance} from "../types/http-service/custom-axios";
import {ApiUtils} from "./api/ApiUtils.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {Role} from "../enums/auth.ts";
import {CancelRequest} from "../types/models/CancelRequest.ts";

export class CancelRequestService {

    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all orders
    public static async getAllCancelRequests(role: Role, controller?: AbortController): Promise<AppResponse<CancelRequest[]>> {
        let ep = ApiUtils.epByRole(role, `orders/cancel-requests`);
        const res = await this.api().get<any, AxiosAppResponse<CancelRequest[]>>(ep, {
            signal: controller?.signal,
        });
        return res.data;
    }

    public static async processCancelRequest(role: Role, requestId: string, isApproved: any): Promise<AppResponse<CancelRequest[]>> {
        let ep = ApiUtils.epByRole(role, `orders/cancel/${requestId}/process`);
        const res = await this.api().post<{ isApproved: boolean }, AxiosAppResponse<CancelRequest[]>>(ep, {isApproved: isApproved} );
        return res.data;
    }
}
