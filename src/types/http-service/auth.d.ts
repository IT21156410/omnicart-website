
export interface UserLoginData {
    email: string;
    password: string;
    source?: number;
    rememberMe?: boolean;
}

export interface UserSignUpData {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    role: string;
    adminToken?: string;
}

export interface ForgotPswData {
    email: string;
}

export interface ResetPswData {
    email: string;
    token: string;
    newPassword: string;
}

export interface TwoFAVerifyData {
    email: string;
    code: string;
}

