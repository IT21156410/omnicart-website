export interface Review {
    id: string;
    vendorId: string;
    customerId: string;
    comment: string;
    rating: number;
    createdAt: Date;
    updatedAt?: Date;
}
