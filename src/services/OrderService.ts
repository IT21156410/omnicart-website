import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {
    Order,
    OrderStatus,
    PaymentStatus,
} from "../types/models/Order.ts";
import {ApiUtils} from "./api/ApiUtils.ts";

export class OrderService {

    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all orders
    public static async getAllOrders(controller?: AbortController, isAdmin?: boolean): Promise<AppResponse<Order[]>> {
        const ep = isAdmin ? ApiUtils.adminUrl('orders') : ApiUtils.vendorUrl("orders");
        const res = await this.api().get<Partial<Order>, AxiosAppResponse<Order[]>>(ep, {
            signal: controller?.signal,
        });
        return res.data;
    }

    // Get an order by ID
    public static async getOrderById(orderId: string): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl(`orders/${orderId}`);
        const res = await this.api().get<Partial<Order>, AxiosAppResponse<Order>>(ep);
        return res.data;
    }

    // Create a new order
    public static async createOrder(orderData: Partial<Order>): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl("orders");
        const res = await this.api().post<Partial<Order>, AxiosAppResponse<Order>>(ep, orderData);
        return res.data;
    }

    // Update an order
    public static async updateOrder(orderData: Partial<Order>, orderId: string): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl(`orders/${orderId}`);
        const res = await this.api().put<Partial<Order>, AxiosAppResponse<Order>>(ep, orderData);
        return res.data;
    }

    // Delete an order
    public static async deleteOrder(orderId: string): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl(`orders/${orderId}`);
        const res = await this.api().delete<Partial<Order>, AxiosAppResponse<Order>>(ep);
        return res.data;
    }

    // Update order status
    public static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl(`orders/${orderId}/status`);
        const res = await this.api().patch<{ status: number }, AxiosAppResponse<Order>>(ep, status);
        return res.data;
    }

    // Update payment status
    public static async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl(`orders/${orderId}/payment-status`);
        const res = await this.api().patch<{ status: number }, AxiosAppResponse<Order>>(ep, status);
        return res.data;
    }
}
