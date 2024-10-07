import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {CreateUserData, UpdateUserData, User} from "../types";
import {ApiUtils} from "./api/ApiUtils.ts";

export class UserService {
    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    public static async getAllUsers(controller?: AbortController, isAdmin = true): Promise<AppResponse<User[]>> {
        const ep = isAdmin ? ApiUtils.adminUrl('users') : ApiUtils.vendorUrl("users");
        const res = await this.api().get<Partial<User>, AxiosAppResponse<User[]>>(ep, {signal: controller?.signal});
        return res.data;
    }

    public static async createUser(createUserData: CreateUserData): Promise<AppResponse<User>> {

        // const data = convertToAPIObj(createUserData);
        const ep = ApiUtils.adminUrl(`users`);
        const res = await this.api().post<UpdateUserData, AxiosAppResponse<User>>(ep, createUserData);
        return res.data;
    }

    public static async updateUser(updateUserData: UpdateUserData, userId: string): Promise<AppResponse<User>> {

        //const formData = convertToAPIFormData(updateUserData, true);
        //const config: AxiosRequestConfig = {params: {_method: 'PUT'}};
        const ep = ApiUtils.adminUrl(`users/${userId}`);
        const res = await this.api().put<UpdateUserData, AxiosAppResponse<User>>(ep, updateUserData);
        return res.data;
    }

    // user activation
    public static async updateUserStatus(userId: string, status: boolean): Promise<AppResponse<User>> {
        const ep = ApiUtils.csrUrl(`users/${userId}/activate`);
        const res = await this.api().patch<{ stock: number }, AxiosAppResponse<User>>(ep, {isActive: status});
        return res.data;
    }

    public static async deleteUser(userId: string): Promise<AppResponse<User>> {

        const ep = ApiUtils.adminUrl(`users/${userId}`);
        const res = await this.api().delete<UpdateUserData, AxiosAppResponse<User>>(ep);
        return res.data;
    }
}
