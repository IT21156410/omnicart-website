import React, {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {UserLoginData} from "../../types/http-service/auth";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";
import {Image} from "antd";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";

export const LoginPage = () => {

    const navigate = useNavigate();
    const {addNotification} = useNotification();
    const {login, user, is2FAVerified} = useAuth();

    const initUserLoginData: UserLoginData = {
        email: "",
        password: "",
        rememberMe: false,
    };

    const [userLoginData, setUserLoginData] = useState<UserLoginData>(initUserLoginData);
    const [hasValidationErr, setHasValidationErr] = useState<boolean[]>([]);
    const [emailErrMsg, setEmailErrMsg] = useState<string>('');
    const [passwordErrMsg, setPasswordErrMsg] = useState<string>('');
    const [errors, setErrors] = useState<any>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);


    if (user && !is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    } else if (user && is2FAVerified) {
        navigate(-1);
    }

    const validateFormData = (data: UserLoginData): boolean[] => {
        setHasValidationErr([]);
        if (Object.prototype.hasOwnProperty.call(data, 'email') && data.email === "") {
            const errorText = 'Please enter the email.';
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(''), 3000);
            hasValidationErr.push(true);

        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            const errorText = 'Please enter a valid email.';
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(''), 3000);
            hasValidationErr.push(true);
        }
        if (Object.prototype.hasOwnProperty.call(data, 'password') && data.password === "") {
            const errorText = 'Please enter the password.';
            setPasswordErrMsg(errorText);
            setTimeout(() => setPasswordErrMsg(''), 3000);
            hasValidationErr.push(true);

        } else if (data.password && data.password.toString().length < 8) {
            const errorText = 'Password must be at least 8 characters long.';
            setPasswordErrMsg(errorText);
            setTimeout(() => setPasswordErrMsg(''), 3000);
            hasValidationErr.push(true);
        }
        return hasValidationErr;
    };

    const handleLogin: FormEventHandler = async (e: any) => {
        e.preventDefault();
        setErrors(null);

        try {
            if (!validateFormData(userLoginData).includes(true)) {
                setIsDisable(true);
                const res = await login(userLoginData);
                if (res) addNotification(res.message, "success", "Success");
            } else {
                setIsDisable(false);
                console.error('SIGN IN FAILED: Please enter valid data.');
            }
        } catch (error: any) {
            setIsDisable(false);
            if (error.response?.status >= 500) {
                setErrors("An unexpected error occurred. Please try again.");
            } else {
                setErrors(error.response?.data?.message);
                addNotification(error.response?.data?.message, "error", "Error");
            }
        }
    };

    const emailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserLoginData((prevState) => ({
            ...prevState,
            email: trimText(event.target.value, true) as string,
        }));
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserLoginData((prevState) => ({
            ...prevState,
            password: trimText(event.target.value, true) as string,
        }));
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={6}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-center align-items-center">
                                <Image
                                    src={"/omnicart-logo.webp"}
                                    style={{maxWidth: '140px', height: 'auto', cursor: 'pointer'}}
                                    preview={false}
                                    onClick={() => navigate("/")}
                                />
                            </div>
                            <h2 className="text-center mb-4">Login</h2>
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group id="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={userLoginData.email}
                                        onChange={emailChange}
                                        placeholder="Enter your email"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{emailErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group id="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <div className="d-flex align-items-center position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={userLoginData.password}
                                            onChange={passwordChange}
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            className="position-absolute end-0 me-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{cursor: "pointer"}}
                                        >
                                            {showPassword ? (
                                                <EyeInvisibleOutlined/>
                                            ) : (
                                                <EyeOutlined/>
                                            )}
                                        </span>
                                    </div>
                                    <Form.Text className="text-danger">
                                        <small>{passwordErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className={`mt-3 w-100 ${isDisable && "pointer-events-none"}`}
                                    variant="dark"
                                    disabled={isDisable}
                                >
                                    Login
                                </Button>
                            </Form>

                            <div className="mt-3 text-center">
                                <Link to="/forgot-password" className="text-primary">
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="mt-2 text-center">
                                <span>Don&apos;t have an account? </span>
                                <Link to="/register" className="text-primary">
                                    Register
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
