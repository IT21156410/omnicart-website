import {Suspense} from "react";
import {Await, useLoaderData, useOutlet} from "react-router-dom";

import {AuthProvider} from "../hooks/useAuth";
import {Alert, Spin} from "antd";
import {User} from "../types";
import {NotificationProvider} from "../hooks/useNotification.tsx";
import {AppResponse} from "../types/http-service/response";

export const Root = () => {
    const outlet = useOutlet();

    const {userPromise} = useLoaderData() as { userPromise: Promise<AppResponse<User>> };

    return (
        <Suspense
            fallback={<Spin size="large" className="d-flex justify-content-center align-items-center min-vh-100"/>}>
            <Await
                resolve={userPromise}
                errorElement={<Alert type="error" message="Something went wrong!"/>}
                children={(user: AppResponse<User>) => {
                    return (
                        <NotificationProvider>
                            <AuthProvider>{outlet}</AuthProvider>
                        </NotificationProvider>
                    );
                }}
            />
        </Suspense>
    );
};
