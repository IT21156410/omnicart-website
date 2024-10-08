export enum CancelRequestStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected'
}

export interface CancelRequest {
    id: string;
    orderId: string;
    customerId: string;
    reason?: string;
    status: CancelRequestStatus;
    requestedDate: Date;
}
