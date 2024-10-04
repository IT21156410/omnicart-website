import {User} from "../index";
import {Category} from "./category.ts";

export enum ProductStatus {
    Pending = "Pending",
    Active = "Active",
    Inactive = "Inactive",
    Rejected = "Rejected"
}

export interface Product {
    id: string;
    userId: string;
    vendorInfo?: User;
    name: string;
    categoryId?: string;
    category?: Category;
    photos: string[];
    condition: 'New' | 'Used';
    description: string;
    status: ProductStatus;
    stock: number;
    sku: string;
    price: number;
    discount: number;
    productWeight: number;
    width: number;
    height: number;
    length: number;
    shippingFee: number;
}

export interface CreateProductData {
    name: string;
    categoryId?: string;
    category?: Category;
    photos: string[];
    condition: 'New' | 'Used';
    description: string;
    status: ProductStatus;
    stock: number;
    sku: string;
    price: number;
    discount: number;
    productWeight: number;
    width: number;
    height: number;
    length: number;
    shippingFee: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
    id?: string;
}