class ServiceUtils {

    public static setAccessToken(token: string): void {
        localStorage.setItem("x-token", token);
    }

    public static getAccessToken(): string | null {
        return localStorage.getItem("x-token");
    }

    public static removeAccessToken(): void {
        localStorage.removeItem('x-token');
    }
}

export default ServiceUtils;
