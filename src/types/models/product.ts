export enum ProductStatus {
    Active = 1,
    Inactive = 2,
    OutOfStock = 3,
    Discontinued = 4
}

export interface Product {
    id: string;
    name: string;
    category: string;
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
    category: string;
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