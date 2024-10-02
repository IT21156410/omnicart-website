import React, {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Navigate, Link} from "react-router-dom";
import {Container, Row, Col, Form, Button, Card, Alert} from "react-bootstrap";
import {UserSignUpData} from "../../types/http-service/auth";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";

export const RegisterPage = () => {

    const {addNotification} = useNotification();
    const {register, user, is2FAVerified} = useAuth();

    const initUserSignUpData: UserSignUpData = {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    };

    const [userSignUpData, setUserSignUpData] = useState<UserSignUpData>(initUserSignUpData);
    const [hasValidationErr, setHasValidationErr] = useState<boolean[]>([]);
    const [nameErrMsg, setNameErrMsg] = useState<string>("");
    const [emailErrMsg, setEmailErrMsg] = useState<string>("");
    const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
    const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState<string>("");
    const [errors, setErrors] = useState<any>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);

    if (user && !is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    }

    const validateFormData = (data: any): boolean[] => {
        setHasValidationErr([]);
        if (data.hasOwnProperty("name") && data.name === "") {
            const errorText = "Please enter your name.";
            setNameErrMsg(errorText);
            setTimeout(() => setNameErrMsg(""), 3000);
            hasValidationErr.push(true);
        }

        if (data.hasOwnProperty("email") && data.email === "") {
            const errorText = "Please enter the email.";
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(""), 3000);
            hasValidationErr.push(true);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            const errorText = "Please enter a valid email.";
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(""), 3000);
            hasValidationErr.push(true);
        }

        if (data.hasOwnProperty("password") && data.password === "") {
            const errorText = "Please enter the password.";
            setPasswordErrMsg(errorText);
            setTimeout(() => setPasswordErrMsg(""), 3000);
            hasValidationErr.push(true);
        } else if (data.password && data.password.toString().length < 8) {
            const errorText = "Password must be at least 8 characters long.";
            setPasswordErrMsg(errorText);
            setTimeout(() => setPasswordErrMsg(""), 3000);
            hasValidationErr.push(true);
        }

        if (data.password !== data.passwordConfirmation) {
            const errorText = "Passwords do not match.";
            setPasswordConfirmErrMsg(errorText);
            setTimeout(() => setPasswordConfirmErrMsg(""), 3000);
            hasValidationErr.push(true);
        }

        return hasValidationErr;
    };

    const handleRegister: FormEventHandler = async (e: any) => {
        e.preventDefault();
        setErrors(null);

        try {
            if (!validateFormData(userSignUpData).includes(true)) {
                setIsDisable(true);
                const res = await register(userSignUpData);
                addNotification(res.message, "success", "Success");
            } else {
                setIsDisable(false);
                console.error("SIGN UP FAILED: Please enter valid data.");
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

    const nameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserSignUpData((prevState) => ({
            ...prevState,
            name: trimText(event.target.value, true) as string,
        }));
    };

    const emailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserSignUpData((prevState) => ({
            ...prevState,
            email: trimText(event.target.value, true) as string,
        }));
    };

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserSignUpData((prevState) => ({
            ...prevState,
            password: trimText(event.target.value, true) as string,
        }));
    };

    const passwordConfirmChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserSignUpData((prevState) => ({
            ...prevState,
            passwordConfirmation: trimText(event.target.value, true) as string,
        }));
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Register</h2>
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={handleRegister}>
                                <Form.Group id="name" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={userSignUpData.name}
                                        onChange={nameChange}
                                        placeholder="Enter your name"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{nameErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group id="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={userSignUpData.email}
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
                                        value={userSignUpData.password}
                                        onChange={passwordChange}
                                        placeholder="Enter your password"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{passwordErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group id="passwordConfirmation" className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="passwordConfirmation"
                                        value={userSignUpData.passwordConfirmation}
                                        onChange={passwordConfirmChange}
                                        placeholder="Confirm your password"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{passwordConfirmErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className={`w-100 ${isDisable && "pointer-events-none"}`}
                                    variant="dark"
                                    disabled={isDisable}
                                >
                                    Register
                                </Button>
                            </Form>

                            <div className="mt-2 text-center">
                                <span>Already have an account? </span>
                                <Link to="/login" className="text-primary">
                                    Login
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
