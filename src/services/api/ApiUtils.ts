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

}
