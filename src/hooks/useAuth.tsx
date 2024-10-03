import {createContext, PropsWithChildren, useCallback, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "./useLocalStorage";
import {User} from "../types";
import {AuthService} from "../services/AuthService.ts";
import {AppResponse} from "../types/http-service/response";
import {ForgotPswData, ResetPswData, TwoFAVerifyData, UserLoginData, UserSignUpData} from "../types/http-service/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    is2FAVerified: boolean;
    resetPswEmail: string | null;
    register: (data: UserSignUpData) => Promise<AppResponse<any>>;
    login: (data: UserLoginData) => Promise<AppResponse<any>>;
    logout: () => Promise<void>;
    forgotPassword: (data: ForgotPswData) => Promise<AppResponse<any>>;
    resetPassword: (data: ResetPswData) => Promise<AppResponse<any>>;
    verify2FACode: (data: TwoFAVerifyData) => Promise<AppResponse<any>>;
    send2FAVerifyCode: (data: string) => Promise<AppResponse<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: PropsWithChildren) => {

    const navigate = useNavigate();

    const [user, setUser] = useLocalStorage<User | null>("user", null);
    const [token, setToken] = useLocalStorage<string | null>("x-token", null);
    const [is2FAVerified, setIs2FAVerified] = useLocalStorage<boolean>("is2FAVerified", false);
    const [resetPswEmail, setResetPswEmail] = useLocalStorage<string | null>("resetPswEmail", null);

    const register = useCallback(async (data: UserSignUpData) => {
        try {
            const response = await AuthService.register(data);
            if (response.success && response.message && response.data) {
                setUser(response.data.user);
                setToken(response.data.token);
                return response;
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const login = useCallback(async (data: UserLoginData) => {
        try {
            const response = await AuthService.login(data);
            if (response.success && response.message && response.data) {
                setUser(response.data.user);
                setToken(response.data.token);
                return response;
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        setToken(null);
        setIs2FAVerified(false);
        setResetPswEmail(null);
        navigate("/", {replace: true});
    }, [navigate]);

    const forgotPassword = useCallback(async (data: ForgotPswData) => {
        try {
            const response = await AuthService.forgetPasswordSendEmail(data);
            if (response.success) {
                setResetPswEmail(data.email);
                return response;
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const resetPassword = useCallback(async (data: ResetPswData) => {
        try {
            const response = await AuthService.resetPasswordByEmail(data);
            if (response.success) {
                setUser(null);
                setToken(null);
                setIs2FAVerified(false);
                setResetPswEmail(null);
                return response;
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const verify2FACode = async (data: TwoFAVerifyData) => {
        try {
            const response = await AuthService.verify2FAByMail(data);
            if (response.success) {
                setIs2FAVerified(true);
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    const send2FAVerifyCode = async (data: string) => {
        try {
            const response = await AuthService.send2FAVerifyCode(data);
            if (response.success) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    const value = useMemo(
        () => ({
            user,
            token,
            register,
            login,
            logout,
            forgotPassword,
            resetPassword,
            resetPswEmail,
            is2FAVerified,
            verify2FACode,
            send2FAVerifyCode,
        }),
        [user, token, resetPswEmail, is2FAVerified]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
