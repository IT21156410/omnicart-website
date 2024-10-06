import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {ApiUtils} from "./api/ApiUtils.ts";
import {Category, CreateCategoryData, UpdateCategoryData} from "../types/models/category.ts";

export class CategoryService {
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    public static async all(controller?: AbortController): Promise<AppResponse<Category[]>> {
        const ep = ApiUtils.publicUrl("categories");
        const res = await this.api().get<never, AxiosAppResponse<Category[]>>(ep, {signal: controller?.signal});
        return res.data;
    }

    public static async getCategoryById(productId: string): Promise<AppResponse<Category>> {
        const ep = ApiUtils.adminUrl(`categories/${productId}`);
        const res = await this.api().get<Partial<Category>, AxiosAppResponse<Category>>(ep);
        return res.data;
    }

    public static async create(createData: CreateCategoryData): Promise<AppResponse<Category>> {

        // const data = convertToAPIObj(createData);
        const ep = ApiUtils.adminUrl(`categories`);
        const res = await this.api().post<CreateCategoryData, AxiosAppResponse<Category>>(ep, createData);
        return res.data;
    }

    public static async update(updateData: UpdateCategoryData, id: string): Promise<AppResponse<Category>> {

        //const formData = convertToAPIFormData(updateData, true);
        //const config: AxiosRequestConfig = {params: {_method: 'PUT'}};
        const ep = ApiUtils.adminUrl(`categories/${id}`);
        const res = await this.api().put<UpdateCategoryData, AxiosAppResponse<Category>>(ep, updateData);
        return res.data;
    }


    public static async delete(id: string): Promise<AppResponse<Category>> {

        const ep = ApiUtils.adminUrl(`categories/${id}`);
        const res = await this.api().delete<never, AxiosAppResponse<Category>>(ep);
        return res.data;
    }
}