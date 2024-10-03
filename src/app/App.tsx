import '../styles/App.css'
import {LoginPage} from "./auth/LoginPage.tsx";
import {createBrowserRouter, createRoutesFromElements, defer, Route} from "react-router-dom";
import Dashboard from "./dashboard/Page.tsx";
import Home from "./landing/Home.tsx";
import {ProtectedLayout} from "../layouts/auth/AuthenticatedLayout.tsx";
import {Verify2FAPage} from "./auth/Verify2FAPage.tsx";
import {GuestLayout} from "../layouts/guest/GuestLayout.tsx";
import {Root} from "../layouts/Root.tsx";
import {User} from "../types";
import UserManagement from "./dashboard/admin/users/Page.tsx";
import CreateProduct from "./dashboard/vendor/products/Create.tsx";
import ManageProducts from "./dashboard/vendor/products/ManageProducts.tsx";
import {RegisterPage} from "./auth/RegisterPage.tsx";
import {ForgotPasswordPage} from "./auth/ForgotPasswordPage.tsx";
import {ResetPasswordPage} from "./auth/ResetPasswordPage.tsx";

const getUserData = () =>
    new Promise((resolve) =>
        setTimeout(() => {
            const user = window.localStorage.getItem("user");
            resolve(user ? JSON.parse(user) as User : null);
        }, 1000)
    );

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            element={<Root/>}
            loader={() => defer({userPromise: getUserData()})}
        >
            <Route path="/" element={<Home/>}/>
            <Route element={<GuestLayout/>}>
                <Route path="/verify-2fa" element={<Verify2FAPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>
            </Route>

            <Route element={<ProtectedLayout/>}>
                <Route path="/admin">
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="users" element={<UserManagement/>}/>
                    {/*<Route path="profile" element={<ProfilePage/>}/>*/}
                    {/*<Route path="settings" element={<SettingsPage/>}/>*/}
                </Route>
                <Route path="/vendor">
                    <Route path="products" element={<ManageProducts/>}/>
                    <Route path="products/create" element={<CreateProduct/>}/>
                </Route>
            </Route>
        </Route>
    )
);

