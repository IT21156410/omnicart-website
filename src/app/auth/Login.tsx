import {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Navigate} from "react-router-dom";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login, user, is2FAVerified} = useAuth();

    if (user && !is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    }

    const handleLogin: FormEventHandler = async (e) => {
        e.preventDefault();
        // Here you would usually send a request to your backend to authenticate the user
        // For the sake of this example, we're using a mock authentication
        if (username === "user" && password === "password") {
            // Replace with actual authentication logic
            await login({id: 1, name: "test", email: "test@test.com"});
        } else {
            alert("Invalid username or password");
        }
    };
    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};