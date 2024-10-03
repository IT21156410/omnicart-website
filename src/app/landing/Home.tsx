import {Link, useNavigate} from "react-router-dom";
import {Button, Image} from "antd";
import React from "react";
import {useAuth} from "../../hooks/useAuth.tsx";

const Home = () => {

    const navigate = useNavigate();
    const {user, token, logout} = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <div className="d-flex justify-content-between p-4">
                <div className="">
                    <div className="d-flex justify-content-around gap-4 align-items-center">
                        <div className="d-flex justify-content-center align-items-center">
                            <Image
                                src={"/omni-cart.webp"}
                                style={{maxWidth: '60px', height: 'auto', cursor: 'pointer'}}
                                preview={false}
                                onClick={() => navigate("/")}
                            />
                        </div>
                        <Link to="/">Home</Link>
                        {!(user && token) && (
                            <Link to="/login">Login</Link>
                        )}
                    </div>
                </div>

                {(user && token) && (
                    <div style={{marginLeft: 'auto', marginRight: '16px'}}>
                        <Button
                            type="default"
                            onClick={handleLogout}
                        >
                            <strong>
                                <i className="bi bi-box-arrow-in-right text-dark" style={{fontSize: '24px'}}></i>
                            </strong>
                        </Button>
                    </div>)}
            </div>
            <div className="d-flex justify-content-between p-4">
                <h1>This is the Home Page</h1>
            </div>
        </>
    );
};

export default Home;
