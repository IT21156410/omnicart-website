import {User} from "../index";

export enum OrderStatus {
    Pending = "Pending",
    Processing = "Processing",
    Shipped = "Shipped",
    PartiallyDelivered = "PartiallyDelivered",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
}

export enum PaymentStatus {
    Pending = "Pending",
    Paid = "Paid",
    Failed = "Failed",
}

export const statusColors: { [key in OrderStatus]: string } = {
    [OrderStatus.Pending]: 'orange',
    [OrderStatus.Processing]: 'blue',
    [OrderStatus.Shipped]: 'purple',
    [OrderStatus.PartiallyDelivered]: 'green',
    [OrderStatus.Delivered]: 'green',
    [OrderStatus.Cancelled]: 'gray',
};

export interface OrderItem {
    productId: string;
    vendorId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: OrderStatus;
}

export interface Order {
    id: string;
    userId: string;
    vendorInfo?: User;
    orderNumber: string;
    orderDate: Date;
    totalAmount: number;
    shippingAddress: string;
    status: OrderStatus;
    items: OrderItem[];
    shippingFee: number;
    paymentStatus: PaymentStatus;
    note?: string;  // Optional note
}

export interface CreateOrderData {
    userId: string;
    orderNumber: string;
    orderDate: Date;
    totalAmount: number;
    shippingAddress: string;
    status: OrderStatus;
    items: OrderItem[];
    shippingFee: number;
    paymentStatus: PaymentStatus;
    note?: string;
}

export interface AddOrderItemData {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
    id?: string;
}
