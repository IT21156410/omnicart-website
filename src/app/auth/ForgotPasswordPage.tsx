import React, {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Container, Row, Col, Form, Button, Card, Alert} from "react-bootstrap";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";
import {Link} from "react-router-dom";
import {ForgotPswData} from "../../types/http-service/auth";

export const ForgotPasswordPage = () => {

    const {addNotification} = useNotification();
    const {forgotPassword} = useAuth();

    const initForgotPswData: ForgotPswData = {
        email: "",
    };

    const [forgotPswData, setForgotPswData] = useState<ForgotPswData>(initForgotPswData);
    const [emailErrMsg, setEmailErrMsg] = useState<string>('');
    const [errors, setErrors] = useState<any>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);

    const validateFormData = (data: any): boolean => {
        if (data.email === "") {
            const errorText = 'Please enter the email.';
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(''), 3000);
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            const errorText = 'Please enter a valid email.';
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(''), 3000);
            return false;
        }
        return true;
    };

    const handleForgotPassword: FormEventHandler = async (e: any) => {
        e.preventDefault();
        setErrors(null);

        if (validateFormData(forgotPswData)) {
            try {
                setIsDisable(true);
                const res = await forgotPassword(forgotPswData);
                addNotification(res.message, "success", "Success");
            } catch (error) {
                setIsDisable(false);
                if (error.response?.status >= 500) {
                    setErrors("An unexpected error occurred. Please try again.");
                } else {
                    setErrors(error.response.data.message);
                    addNotification(error.response.data.message, "error", "Error");
                }
            }
        }
    };

    const emailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForgotPswData((prevState) => ({
            ...prevState,
            email: trimText(event.target.value, true) as string,
        }));
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Forgot Password</h2>
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={handleForgotPassword}>
                                <Form.Group id="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={forgotPswData.email}
                                        onChange={emailChange}
                                        placeholder="Enter your email"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{emailErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className={`w-100 ${isDisable && "pointer-events-none"}`}
                                    variant="dark"
                                    disabled={isDisable}
                                >
                                    Submit
                                </Button>
                            </Form>

                            <div className="mt-3 text-center">
                                <Link to="/login" className="text-primary">
                                    Back to Login
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
