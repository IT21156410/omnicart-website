import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {
    Order,
    OrderStatus,
    PaymentStatus,
} from "../types/models/Order.ts";
import {ApiUtils} from "./api/ApiUtils.ts";
import {Role} from "../enums/auth.ts";

export class OrderService {

    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all orders
    public static async getAllOrders(role: Role, controller?: AbortController): Promise<AppResponse<Order[]>> {
        let ep = ApiUtils.epByRole(role, 'orders');
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
    public static async updateOrderStatus(role: Role, orderId: string, status: OrderStatus): Promise<AppResponse<Order>> {
        let ep = ApiUtils.epByRole(role, `orders/${orderId}/status`);
        const res = await this.api().patch<{ status: string }, AxiosAppResponse<Order>>(ep, {status: status});
        return res.data;
    }

    // Cancel order with note
    public static async cancelOrder(orderId: string, note: string, role: Role): Promise<AppResponse<Order>> {
        let ep = ApiUtils.epByRole(role, `orders/${orderId}/cancel`);
        const res = await this.api().patch<{ note: string }, AxiosAppResponse<Order>>(ep, {note: note});
        return res.data;
    }

    // Update order items
    public static async updateOrderItemStatus(orderId: string, productId: string, status: OrderStatus, role: Role): Promise<AppResponse<Order>> {
        let ep = ApiUtils.epByRole(role, `orders/${orderId}/items/${productId}/status`);
        const res = await this.api().patch<{ status: string }, AxiosAppResponse<Order>>(ep, {status: status});
        return res.data;
    }

    // Update payment status
    public static async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<AppResponse<Order>> {
        const ep = ApiUtils.vendorUrl(`orders/${orderId}/payment-status`);
        const res = await this.api().patch<{ status: number }, AxiosAppResponse<Order>>(ep, status);
        return res.data;
    }
}
