import '../styles/App.css'
import {LoginPage} from "./auth/LoginPage.tsx";
import {createBrowserRouter, createRoutesFromElements, defer, Route} from "react-router-dom";
import Dashboard from "./dashboard/Page.tsx";
import Home from "./landing/Home.tsx";
import {ProtectedLayout} from "../layouts/auth/AuthenticatedLayout.tsx";
import {Verify2FAPage} from "./auth/Verify2FAPage.tsx";
import {GuestLayout} from "../layouts/guest/GuestLayout.tsx";
import {Root} from "../layouts/Root.tsx";
import UserManagement from "./dashboard/admin/users/Page.tsx";
import CreateProduct from "./dashboard/vendor/products/Create.tsx";
import ManageProducts from "./dashboard/vendor/products/ManageProducts.tsx";
import UpdateProduct from "./dashboard/vendor/products/Edit.tsx";
import {RegisterPage} from "./auth/RegisterPage.tsx";
import {ForgotPasswordPage} from "./auth/ForgotPasswordPage.tsx";
import {ResetPasswordPage} from "./auth/ResetPasswordPage.tsx";
import {AuthService} from "../services/AuthService.ts";
import ManageCategories from "./dashboard/admin/categories/ManageCategories.tsx";
import CreateCategory from "./dashboard/admin/categories/Create.tsx";
import EditCategory from "./dashboard/admin/categories/Edit.tsx";
import ManageOrders from "./dashboard/vendor/orders/ManageOrders.tsx";

const getUserData = () =>
    new Promise((resolve) => {
        AuthService.getOwnUser()
            .then(response => resolve(response.data))
            .catch(e => resolve(null))
    });

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
                    {/*// TODO: add separate or dynamic dashboard according to the role*/}
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="users" element={<UserManagement/>}/>
                    <Route path="products" element={<ManageProducts isAdmin/>}/>
                    <Route path="categories" element={<ManageCategories/>}/>
                    <Route path="categories/create" element={<CreateCategory/>}/>
                    <Route path="categories/:id/edit" element={<EditCategory/>}/>
                    <Route path="orders" element={<ManageOrders isAdmin/>}/>
                    {/*<Route path="profile" element={<ProfilePage/>}/>*/}
                </Route>
                <Route path="/vendor">
                    {/* // TODO: add separate or dynamic dashboard according to the role*/}
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="products" element={<ManageProducts/>}/>
                    <Route path="products/create" element={<CreateProduct/>}/>
                    <Route path="products/:id/edit" element={<UpdateProduct/>}/>
                    <Route path="orders" element={<ManageOrders/>}/>
                </Route>
            </Route>
        </Route>
    )
);

