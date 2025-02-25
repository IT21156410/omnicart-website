import {ApiInstance} from "../types/http-service/custom-axios";
import ApiService from "./api/ApiService.ts";
import {ApiUtils} from "./api/ApiUtils.ts";
import {AppResponse, AxiosAppResponse} from "../types/http-service/response";
import {ForgotPswData, ResetPswData, TwoFAVerifyData, UserLoginData, UserSignUpData} from "../types/http-service/auth";
import {User} from "../types";

export class AuthService {

    private static api(): ApiInstance {
        return ApiService.getInstance().getApi();
    }

    public static async csrf(): Promise<void> {
        const ep = ApiUtils.apiUrl + "/sanctum/csrf-cookie";
        await AuthService.api().get(ep);
    };

    public static async register(userData: UserSignUpData): Promise<AppResponse<{ user: User, token: string }>> {
        const ep = ApiUtils.publicUrl("register");
        const res = await AuthService.api().post<UserSignUpData, AxiosAppResponse<{ user: User, token: string }>>(ep, userData);
        return res.data;
    }

    public static async login(userData: UserLoginData): Promise<AppResponse<{ user: User, token: string }>> {
        const ep = ApiUtils.publicUrl("login");
        const res = await AuthService.api()
            .post<UserLoginData, AxiosAppResponse<{ user: User, token: string }>>(ep, userData);

        return res.data;
    }

    // public static async logout(): Promise<AppResponse<any>> {
    //     const ep = ApiUtils.publicUrl("logout");
    //     const res = await AuthService.api().post<any, AxiosAppResponse<any>>(ep);
    //     return res.data;
    // }

    public static async getOwnUser(): Promise<AppResponse<User>> {
        const ep = ApiUtils.publicUrl("own-user");
        const res = await AuthService.api().get<Partial<User>, AxiosAppResponse<User>>(ep);
        return res.data;
    }

    public static async forgetPasswordSendEmail(forgotData: ForgotPswData): Promise<AppResponse<any>> {
        const ep = ApiUtils.publicUrl("forgot-password");
        const res = await AuthService.api().post<string, AxiosAppResponse<any>>(ep, forgotData);
        return res.data;
    }

    public static async resetPasswordByEmail(resetData: ResetPswData): Promise<AppResponse<any>> {
        const ep = ApiUtils.publicUrl("reset-password");
        const res = await AuthService.api().post<ResetPswData, AxiosAppResponse<any>>(ep, resetData);
        return res.data;
    }

    public static async verify2FAByMail(twoFAData: TwoFAVerifyData): Promise<AppResponse<any>> {
        const ep = ApiUtils.publicUrl("verify-2fa");
        const res = await AuthService.api().post<TwoFAVerifyData, AxiosAppResponse<any>>(ep, twoFAData);
        return res.data;
    }

    public static async send2FAVerifyCode(email: string): Promise<AppResponse<any>> {
        const ep = ApiUtils.publicUrl("send-2fa-verify");
        const res = await AuthService.api().post<string, AxiosAppResponse<any>>(ep, {email: email});
        return res.data;
    }

}
