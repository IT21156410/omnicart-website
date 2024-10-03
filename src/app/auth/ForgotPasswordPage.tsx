import React, {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Container, Row, Col, Form, Button, Card, Alert, Modal} from "react-bootstrap";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {ForgotPswData} from "../../types/http-service/auth";

export const ForgotPasswordPage = () => {

    const navigate = useNavigate();
    const {addNotification} = useNotification();
    const {forgotPassword, user, is2FAVerified} = useAuth();

    const initForgotPswData: ForgotPswData = {
        email: "",
    };

    const [forgotPswData, setForgotPswData] = useState<ForgotPswData>(initForgotPswData);
    const [emailErrMsg, setEmailErrMsg] = useState<string>("");
    const [errors, setErrors] = useState<any>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

    if (user && !is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    } else if (user && is2FAVerified) {
        navigate(-1);
    }

    const validateFormData = (data: any): boolean => {
        if (data.email === "") {
            const errorText = "Please enter the email.";
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(""), 3000);
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            const errorText = "Please enter a valid email.";
            setEmailErrMsg(errorText);
            setTimeout(() => setEmailErrMsg(""), 3000);
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
                setIsSuccess(true);
            } catch (error) {
                setIsDisable(false);
                if (error.response?.status >= 500) {
                    setErrors("An unexpected error occurred. Please try again.");
                } else {
                    setErrors(error.response?.data?.message);
                    addNotification(error.response?.data?.message, "error", "Error");
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

    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setToken(event.target.value);
    };

    const handleSubmitToken = () => {
        navigate(`/reset-password/${token}`);
        setShowModal(false);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh"}}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={6}>
                    <Card>
                        <Card.Body>
                            {isSuccess ? (
                                <>
                                    <h2 className="text-center mb-4">Successfully sent reset email!</h2>
                                    <Alert variant="success">
                                        Instructions to reset your password have been sent to your email. Please check
                                        your inbox.
                                    </Alert>
                                    <div className="text-center mt-3">
                                        <p>
                                            Click the link in the email to reset your password. If you didn't receive
                                            the email, check your spam folder or try again.
                                        </p>
                                        <hr/>
                                        <p><strong>Or</strong></p>
                                        <p>
                                            Click the below link to reset your password, and put your received token.
                                        </p>
                                        <Button variant="dark" className="w-100" onClick={() => setShowModal(true)}>
                                            Reset Password
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
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
                                            className={`mt-3 w-100 ${isDisable && "pointer-events-none"}`}
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
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal for token input */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="token">
                        <Form.Label>Token</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={token}
                            onChange={handleTokenChange}
                            placeholder="Enter your token"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="dark" onClick={handleSubmitToken}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
