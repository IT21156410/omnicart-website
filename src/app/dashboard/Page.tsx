import {useAuth} from "../../hooks/useAuth.tsx";

const Dashboard = () => {
    const {logout} = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <h1>This is a Secret page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;