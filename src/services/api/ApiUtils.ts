import {Role} from "../../enums/auth.ts";

export class ApiUtils {

    public static apiUrl: string = import.meta.env.VITE_PUBLIC_API_BASE_URL || "";

    public static publicUrl(path: string, apiVersion?: string): string {
        return this.apiUrl + `/api/` + path;
    }

    public static authUrl(path: string, apiVersion?: string): string {
        return this.apiUrl + `/api/auth/` + path;
    }

    public static adminUrl(path: string, apiVersion?: string): string {
        return this.apiUrl + `/api/admin/` + path;
    }

    public static vendorUrl(path: string, apiVersion?: string): string {
        return this.apiUrl + `/api/vendor/` + path;
    }

    public static csrUrl(path: string, apiVersion?: string): string {
        return this.apiUrl + `/api/csr/` + path;
    }

    public static epByRole(role: Role, ep: string): string {
        switch (role) {
            case Role.admin:
                return ApiUtils.adminUrl(ep);
            case Role.vendor:
                return ApiUtils.vendorUrl(ep);
            case Role.csr:
                return ApiUtils.csrUrl(ep);
            case Role.customer:
                return ApiUtils.authUrl(ep);
            default:
                return ApiUtils.adminUrl(ep);
        }
    }

}
