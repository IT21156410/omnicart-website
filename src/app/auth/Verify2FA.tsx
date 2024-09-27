import {FormEventHandler, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";

export const Verify2FA = () => {
    const navigate = useNavigate();
    const {verify2FACode} = useAuth();
    const [code, setCode] = useState("");

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        const isValid = await verify2FACode(code);
        if (isValid) {
            navigate("/super-admin/dashboard");
        } else {
            alert("Invalid code. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
            />
            <button type="submit">Verify</button>
        </form>
    );
};