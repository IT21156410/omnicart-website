import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {CreateProductData, Product, UpdateProductData} from "../types/models/product";
import {ApiUtils} from "./api/ApiUtils.ts";

export class ProductService {
    // Get API instance
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    // Get all products
    public static async getAllProducts(controller?: AbortController, isAdmin?: boolean): Promise<AppResponse<Product[]>> {
        const ep = isAdmin ? ApiUtils.adminUrl('products') : ApiUtils.vendorUrl("products");
        const res = await this.api().get<Partial<Product>, AxiosAppResponse<Product[]>>(ep, {
            signal: controller?.signal,
        });
        return res.data;
    }

    // Get a product by ID
    public static async getProductById(productId: string): Promise<AppResponse<Product>> {
        const ep = ApiUtils.vendorUrl(`products/${productId}`);
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
    public static async updateProductStatus(productId: string, status: number): Promise<AppResponse<Product>> {
        const ep = ApiUtils.publicUrl(`products/status/${productId}`);
        const res = await this.api().put<{ status: number }, AxiosAppResponse<Product>>(ep, {status});
        return res.data;
    }

    // Update product stock
    public static async updateProductStock(productId: string, newStock: number): Promise<AppResponse<Product>> {
        const ep = ApiUtils.publicUrl(`products/stock/${productId}`);
        const res = await this.api().put<{ stock: number }, AxiosAppResponse<Product>>(ep, {stock: newStock});
        return res.data;
    }

}
