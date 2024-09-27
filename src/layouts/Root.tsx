import {Suspense} from "react";
import {Await, useLoaderData, useOutlet} from "react-router-dom";

import {AuthProvider} from "../hooks/useAuth";
import {Alert, Spin} from "antd";
import {User} from "../types";

export const Root = () => {
    const outlet = useOutlet();

    const {userPromise} = useLoaderData() as { userPromise: Promise<User | null> };

    return (
        <Suspense fallback={<Spin size="large" className="d-flex justify-content-center align-items-center min-vh-100"/>}>
            <Await
                resolve={userPromise}
                errorElement={<Alert type="error" message="Something went wrong!"/>}
                children={(user) => (
                    <AuthProvider>{outlet}</AuthProvider>
                )}
            />
        </Suspense>
    );
};
