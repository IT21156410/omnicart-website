import {Role} from "../../enums/auth.ts";

export interface Notification {
    id: string;
    userId?: string;
    roles?: Role;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationRequest {
    userId?: string;
    roles?: Role;
    message: string;
}