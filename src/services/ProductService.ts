import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {CreateProductData, Product, ProductStatus, UpdateProductData} from "../types/models/product";
import {ApiUtils} from "./api/ApiUtils.ts";
import {Role} from "../enums/auth.ts";

export class ProductService {
    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all products
    public static async getAllProducts(controller?: AbortController, config: {
        isAdmin?: boolean,
        filterOutOfStock?: boolean
    } = {isAdmin: false, filterOutOfStock: false}): Promise<AppResponse<Product[]>> {
        const ep = config.isAdmin ? ApiUtils.adminUrl('products') : ApiUtils.vendorUrl("products");
        const res = await this.api().get<Partial<Product>, AxiosAppResponse<Product[]>>(ep, {
            signal: controller?.signal,
            params: {filterOutOfStock: config?.filterOutOfStock},
        });
        return res.data;
    }

    // Get a product by ID
    public static async getProductById(role: Role, productId: string): Promise<AppResponse<Product>> {
        let ep = ApiUtils.epByRole(role, `products/${productId}`);
        const res = await this.api().get<Partial<Product>, AxiosAppResponse<Product>>(ep);
        return res.data;
    }

    // Create a new product
    public static async createProduct(createProductData: CreateProductData): Promise<AppResponse<Product>> {
        const ep = ApiUtils.vendorUrl("products");
        const res = await this.api().post<CreateProductData, AxiosAppResponse<Product>>(ep, createProductData);
        return res.data;
    }

    // Update a product
    public static async updateProduct(updateProductData: UpdateProductData, productId: string): Promise<AppResponse<Product>> {
        const ep = ApiUtils.vendorUrl(`products/${productId}`);
        const res = await this.api().put<UpdateProductData, AxiosAppResponse<Product>>(ep, updateProductData);
        return res.data;
    }

    // Delete a product
    public static async deleteProduct(productId: string): Promise<AppResponse<Product>> {
        const ep = ApiUtils.vendorUrl(`products/${productId}`);
        const res = await this.api().delete<UpdateProductData, AxiosAppResponse<Product>>(ep);
        return res.data;
    }

    // Update product status (Activate/Deactivate)
    public static async updateProductStatus(productId: string, status: ProductStatus): Promise<AppResponse<Product>> {
        const ep = ApiUtils.adminUrl(`products/${productId}/status`);
        const res = await this.api().patch<{ status: number }, AxiosAppResponse<Product>>(ep, {status});
        return res.data;
    }

    // Update product stock
    public static async updateProductStock(productId: string, newStock: number): Promise<AppResponse<Product>> {
        const ep = ApiUtils.vendorUrl(`products/${productId}/stock`);
        const res = await this.api().patch<{ stock: number }, AxiosAppResponse<Product>>(ep, {stock: newStock});
        return res.data;
    }

}
