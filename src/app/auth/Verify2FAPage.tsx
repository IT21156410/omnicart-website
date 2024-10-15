import React, {FormEventHandler, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {useNotification} from "../../hooks/useNotification.tsx";
import {Image} from "antd";

export const Verify2FAPage = () => {

    const navigate = useNavigate();
    const {verify2FACode, send2FAVerifyCode, user} = useAuth();
    const {addNotification} = useNotification();

    const [code, setCode] = useState<string>("");
    const [codeErrMsg, setCodeErrMsg] = useState<string>("");
    const [errors, setErrors] = useState<string | null>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setErrors(null);

        if (!code) {
            setCodeErrMsg("Please enter the verification code.");
            setTimeout(() => setCodeErrMsg(''), 3000);
            return;
        }

        try {
            setIsDisable(true);
            const res = await verify2FACode({code: code, email: user?.email || ""});
            if (res?.success) {
                addNotification(res.message, "success", "Success");
                navigate(`/${user.role}/dashboard`);
            } else {
                setErrors("Invalid code. Please try again.");
            }
        } catch (error) {
            if (error.response?.status >= 500) {
                setErrors("An unexpected error occurred. Please try again.");
            } else {
                setErrors(error.response?.data?.message);
                addNotification(error.response?.data?.message, "error", "Error");
            }
        } finally {
            setIsDisable(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsResendDisabled(true);
            setResendMessage(null);
            setIsDisable(true);
            const res = await send2FAVerifyCode(user?.email || "");
            if (res?.success) {
                setResendMessage("Code sent! Please check your email.");
                addNotification(res.message, "success", "Info");
            }

            setTimeout(() => {
                setIsResendDisabled(false);
            }, 30000);

        } catch (error) {
            if (error.response?.status >= 500) {
                setErrors("An unexpected error occurred. Please try again.");
            } else {
                setErrors(error.response?.data?.message);
                addNotification(error.response?.data?.message, "error", "Error");
            }
        } finally {
            setIsDisable(false);
        }
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
                            <h2 className="text-center mb-4">Two Factor Authentication</h2>
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            {resendMessage && <Alert variant="info">{resendMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="verificationCode" className="mb-3">
                                    <Form.Label>Verification Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Enter verification code"
                                        maxLength={6}
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{codeErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className={`mt-3 w-100 ${isDisable && "pointer-events-none"} app-dark-btn`}
                                    variant="dark"
                                    disabled={isDisable}
                                >
                                    Verify
                                </Button>
                            </Form>
                            <div className="mt-3 text-center">
                                <Button
                                    variant="link"
                                    onClick={handleResendCode}
                                    disabled={isResendDisabled}
                                >
                                    Resend Code
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
