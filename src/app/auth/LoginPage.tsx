import React, {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Navigate, Link} from "react-router-dom";
import {Container, Row, Col, Form, Button, Card, Alert} from "react-bootstrap";
import {UserLoginData} from "../../types/http-service/auth";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";

export const LoginPage = () => {

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

    if (user && !is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    }

    const validateFormData = (data: any): boolean[] => {
        setHasValidationErr([]);
        if (data.hasOwnProperty('email') && data.email === "") {
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
        if (data.hasOwnProperty('password') && data.password === "") {
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
                addNotification(res.message, "success", "Success");
            } else {
                setIsDisable(false);
                console.error('SIGN IN FAILED: Please enter valid data.');
            }
        } catch (error) {
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
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={userLoginData.password}
                                        onChange={passwordChange}
                                        placeholder="Enter your password"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{passwordErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className={`w-100 ${isDisable && "pointer-events-none"}`}
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
