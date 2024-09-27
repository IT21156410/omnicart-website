import {Suspense} from "react";
import {Await, useLoaderData, useOutlet} from "react-router-dom";

import {AuthProvider} from "../hooks/useAuth";
import {Spinner} from "react-bootstrap";
import {Alert} from "antd";
import {User} from "../types";

export const Root = () => {
    const outlet = useOutlet();

    const {userPromise} = useLoaderData() as { userPromise: Promise<User | null> };

    return (
        <Suspense fallback={<Spinner animation="grow"/>}>
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
