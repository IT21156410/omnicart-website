import '../styles/App.css'
import {LoginPage} from "./auth/Login.tsx";
import {createBrowserRouter, createRoutesFromElements, defer, Route} from "react-router-dom";
import Dashboard from "./dashboard/Page.tsx";
import Home from "./Home.tsx";
import {ProtectedLayout} from "../layouts/auth/AuthenticatedLayout.tsx";
import {Verify2FA} from "./auth/Verify2FA.tsx";
import {GuestLayout} from "../layouts/guest/GuestLayout.tsx";
import {Root} from "../layouts/Root.tsx";
import {User} from "../types";

const getUserData = () =>
    new Promise((resolve) =>
        setTimeout(() => {
            const user = window.localStorage.getItem("user");
            resolve(user ? JSON.parse(user) as User : null);
        }, 3000)
    );

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            element={<Root/>}
            loader={() => defer({userPromise: getUserData()})}
        >
            <Route path="/" element={<Home/>}/>
            <Route element={<GuestLayout/>}>
                <Route path="/verify-2fa" element={<Verify2FA/>}/>
                <Route path="/login" element={<LoginPage/>}/>
            </Route>

            <Route path="/super-admin" element={<ProtectedLayout/>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                {/*<Route path="profile" element={<ProfilePage/>}/>*/}
                {/*<Route path="settings" element={<SettingsPage/>}/>*/}
            </Route>
        </Route>
    )
);

