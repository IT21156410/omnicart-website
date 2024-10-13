import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";

import {ApiUtils} from "./api/ApiUtils.ts";
import {NotificationRequest} from "../types/models/notification.ts";

import {Notification} from '../types/models/notification'

export class NotificationService {

    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all notifications for a user or roles
    public static async getNotifications(controller?: AbortController): Promise<AppResponse<Notification[]>> {
        const ep = ApiUtils.publicUrl(`notifications/my`);
        const res = await this.api().get<Partial<Notification>, AxiosAppResponse<Notification[]>>(ep, {
            signal: controller?.signal,
        });
        return res.data;
    }

    // Send a new notification
    public static async sendNotification(notificationRequest: NotificationRequest): Promise<AppResponse<Notification>> {
        const ep = ApiUtils.publicUrl("notifications/send");
        const res = await this.api().post<Partial<NotificationRequest>, AxiosAppResponse<Notification>>(ep, notificationRequest);
        return res.data;
    }

    // Mark a notification as read
    public static async markNotificationAsRead(notificationId: string): Promise<AppResponse<Notification>> {
        const ep = ApiUtils.publicUrl(`notifications/mark-as-read/${notificationId}`);
        const res = await this.api().post<Partial<Notification>, AxiosAppResponse<Notification>>(ep);
        return res.data;
    }

    // Mark a notification as read
    public static async unreadNotificationCountForUser(): Promise<AppResponse<{ unreadCount: number }>> {
        const ep = ApiUtils.publicUrl(`notifications/unread-count`);
        const res = await this.api().get<Partial<Notification>, AxiosAppResponse<{ unreadCount: number }>>(ep);
        return res.data;
    }

    // Delete a notification
    public static async deleteNotification(notificationId: string): Promise<AppResponse<Notification>> {
        const ep = ApiUtils.publicUrl(`notifications/${notificationId}`);
        const res = await this.api().delete<Partial<Notification>, AxiosAppResponse<Notification>>(ep);
        return res.data;
    }
}
