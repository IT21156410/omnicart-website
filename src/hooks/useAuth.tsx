import {createContext, PropsWithChildren, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "./useLocalStorage";
import {User} from "../types";

interface AuthContextType {
    user: User | null;
    login: (data: User) => Promise<void>;
    is2FAVerified: boolean;
    verify2FACode: (code: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: PropsWithChildren) => {
    const [user, setUser] = useLocalStorage<User | null>("user", null);
    const [is2FAVerified, setIs2FAVerified] = useLocalStorage<boolean>("is2FAVerified", false);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const login = async (data: User) => {
        setUser(data);
        navigate("/verify-2fa");
    };

    // call this function to sign out logged in user
    const logout = () => {
        setUser(null);
        setIs2FAVerified(false);
        navigate("/", {replace: true});
    };

    const verify2FACode = async (code: string) => {
        //Mock verification logic
        if (code === "0000") {  // TODO: implement
            setIs2FAVerified(true);
            navigate("/admin/dashboard"); // Navigate to a protected route after successful 2FA
            return true;
        }
        return false;
    };

    const value = useMemo(
        () => ({
            user,
            is2FAVerified,
            login,
            logout,
            verify2FACode,
        }),
        [user, is2FAVerified]
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