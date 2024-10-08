import {Navigate, useOutlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";

export const GuestLayout = () => {

    const {user, is2FAVerified} = useAuth();
    const outlet = useOutlet();

    if (user && is2FAVerified) {
        return <Navigate to={`/${user.role}/dashboard`} replace/>;
    }

    return (
        <div>
            {outlet}
        </div>
    );
};
