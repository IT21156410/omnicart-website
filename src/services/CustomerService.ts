import ApiService from "./api/ApiService.ts";
import {ApiInstance} from "../types/http-service/custom-axios";
import {ApiUtils} from "./api/ApiUtils.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {User} from "../types";

export class OrderService {

    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all orders
    public static async getAllOrders(controller?: AbortController, isAdmin?: boolean): Promise<AppResponse<User[]>> {
        const ep = isAdmin ? ApiUtils.adminUrl('orders') : ApiUtils.vendorUrl("orders");
        const res = await this.api().get<Partial<User>, AxiosAppResponse<User[]>>(ep, {
            signal: controller?.signal,
        });
        return res.data;
    }
}
