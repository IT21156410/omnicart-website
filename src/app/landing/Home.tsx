import {Link} from "react-router-dom";
import {Button} from "antd";
import React from "react";
import {useAuth} from "../../hooks/useAuth.tsx";

const Home = () => {

    const {user, logout} = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <div className="d-flex justify-content-between p-4">
                <div className="">
                    <div className="d-flex justify-content-around gap-4">
                        <Link to="/">Home</Link>
                        <Link to="/login">Login</Link>
                    </div>
                </div>

                <div style={{marginLeft: 'auto', marginRight: '16px'}}>
                    <Button
                        type="default"
                        onClick={handleLogout}
                    >
                        <strong>
                            <i className="bi bi-box-arrow-in-right text-dark" style={{fontSize: '24px'}}></i>
                        </strong>
                    </Button>
                </div>
            </div>
            <div className="d-flex justify-content-between p-4">
                <h1>This is the Home Page</h1>
            </div>
        </>
    );
};

export default Home;
