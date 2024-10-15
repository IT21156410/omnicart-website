import React, {FormEventHandler, useEffect, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Container, Row, Col, Form, Button, Card, Alert} from "react-bootstrap";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ResetPswData} from "../../types/http-service/auth";
import {Image} from "antd";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";

export const ResetPasswordPage = () => {

    const navigate = useNavigate();
    const {addNotification} = useNotification();
    const {resetPassword, user, resetPswEmail} = useAuth();

    // Get token from URL
    const {token} = useParams<{ token: string }>();

    const initResetPswData: ResetPswData = {
        email: user?.email || resetPswEmail || "",
        token: token || "",
        newPassword: "",
    };

    const [resetPswData, setResetPswData] = useState<ResetPswData>(initResetPswData);
    const [passwordErrMsg, setPasswordErrMsg] = useState<string>('');
    const [emailErrMsg, setEmailErrMsg] = useState<string>("");
    const [errors, setErrors] = useState<any>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setErrors("Invalid or missing token.");
        }
    }, [token]);

    const validateFormData = (data: ResetPswData): boolean => {
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
        if (data.newPassword === "") {
            const errorText = 'Please enter a new password.';
            setPasswordErrMsg(errorText);
            setTimeout(() => setPasswordErrMsg(''), 3000);
            return false;
        } else if (data.newPassword.length < 8) {
            const errorText = 'Password must be at least 6 characters long.';
            setPasswordErrMsg(errorText);
            setTimeout(() => setPasswordErrMsg(''), 3000);
            return false;
        }
        return true;
    };

    const handleResetPassword: FormEventHandler = async (e: any) => {
        e.preventDefault();
        setErrors(null);

        if (validateFormData(resetPswData)) {
            try {
                setIsDisable(true);
                const res = await resetPassword(resetPswData);
                addNotification(res!.message, "success", "Success");
                navigate("/login");
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
        }
    };

    const emailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setResetPswData((prevState) => ({
            ...prevState,
            email: trimText(event.target.value, true) as string,
        }));
    };

    const newPasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setResetPswData((prevState) => ({
            ...prevState,
            newPassword: trimText(event.target.value, true) as string,
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
                            <h2 className="text-center mb-4">Reset Password</h2>
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={handleResetPassword}>
                                {!resetPswData.email && (
                                    <Form.Group id="email" className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={resetPswData.email}
                                            onChange={emailChange}
                                            placeholder="Enter your email"
                                        />
                                        <Form.Text className="text-danger">
                                            <small>{emailErrMsg}</small>
                                        </Form.Text>
                                    </Form.Group>
                                )}
                                <Form.Group id="newPassword" className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <div className="d-flex align-items-center position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={resetPswData.newPassword}
                                            onChange={newPasswordChange}
                                            placeholder="Enter your new password"
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
                                    className={`mt-3 w-100 ${isDisable && "pointer-events-none"} app-dark-btn`}
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
