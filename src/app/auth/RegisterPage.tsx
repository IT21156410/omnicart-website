import React, {FormEventHandler, useState} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {UserSignUpData} from "../../types/http-service/auth";
import {useNotification} from "../../hooks/useNotification.tsx";
import {trimText} from "../../utils/util.ts";
import {Image} from "antd";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";

export const RegisterPage = () => {

    const navigate = useNavigate();
    const {addNotification} = useNotification();
    const {register, user, is2FAVerified} = useAuth();

    const initUserSignUpData: UserSignUpData = {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        role: "",
        adminToken: "",
    };

    const [userSignUpData, setUserSignUpData] = useState<UserSignUpData>(initUserSignUpData);
    const [hasValidationErr, setHasValidationErr] = useState<boolean[]>([]);
    const [nameErrMsg, setNameErrMsg] = useState<string>("");
    const [emailErrMsg, setEmailErrMsg] = useState<string>("");
    const [passwordErrMsg, setPasswordErrMsg] = useState<string>("");
    const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState<string>("");
    const [roleErrMsg, setRoleErrMsg] = useState<string>("");
    const [adminTokenErrMsg, setAdminTokenErrMsg] = useState<string>("");
    const [errors, setErrors] = useState<any>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (user && !is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    } else if (user && is2FAVerified) {
        navigate(-1);
    }

    const validateFormData = (data: UserSignUpData): boolean[] => {
        setHasValidationErr([]);
        setNameErrMsg("");
        setEmailErrMsg("");
        setPasswordErrMsg("");
        setPasswordConfirmErrMsg("");
        setRoleErrMsg("");

        if (Object.prototype.hasOwnProperty.call(data, "name") && data.name === "") {
            const errorText = "Please enter your name.";
            setNameErrMsg(errorText);
            setTimeout(() => setNameErrMsg(""), 3000);
            hasValidationErr.push(true);
        }

        if (Object.prototype.hasOwnProperty.call(data, "email") && data.email === "") {
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

        if (Object.prototype.hasOwnProperty.call(data, "password") && data.password === "") {
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

        if (data.role === "") {
            const errorText = "Please select a role.";
            setRoleErrMsg(errorText);
            setTimeout(() => setRoleErrMsg(""), 3000);
            hasValidationErr.push(true);
        } else if (data.role === "admin" && data.adminToken === "") {
            const errorText = "Please enter your admin token.";
            setAdminTokenErrMsg(errorText);
            setTimeout(() => setAdminTokenErrMsg(""), 3000);
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
                if (res) addNotification(res.message, "success", "Success");
            } else {
                setIsDisable(false);
                console.error("SIGN UP FAILED: Please enter valid data.");
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

    const roleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setIsAdmin(event.target.value === 'admin');
        setUserSignUpData((prevState) => ({
            ...prevState,
            role: event.target.value,
        }));
    };

    const adminTokenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserSignUpData((prevState) => ({
            ...prevState,
            adminToken: trimText(event.target.value, true) as string,
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
                                    <div className="d-flex align-items-center position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={userSignUpData.password}
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
                                <Form.Group id="passwordConfirmation" className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <div className="d-flex align-items-center position-relative">
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="passwordConfirmation"
                                            value={userSignUpData.passwordConfirmation}
                                            onChange={passwordConfirmChange}
                                            placeholder="Confirm your password"
                                        />
                                        <span
                                            className="position-absolute end-0 me-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            style={{cursor: "pointer"}}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeInvisibleOutlined/>
                                            ) : (
                                                <EyeOutlined/>
                                            )}
                                        </span>
                                    </div>
                                    <Form.Text className="text-danger">
                                        <small>{passwordConfirmErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group id="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={userSignUpData.role}
                                        onChange={roleChange}
                                    >
                                        <option value="">Select your role</option>
                                        <option value="customer">User</option>
                                        <option value="admin">Admin</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        <small>{roleErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                {isAdmin && (
                                    <Form.Group id="adminToken" className="mb-3">
                                        <Form.Label>Admin Token</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="adminToken"
                                            value={userSignUpData.adminToken}
                                            onChange={adminTokenChange}
                                            placeholder="Enter your admin token"
                                        />
                                        <Form.Text className="text-danger">
                                            <small>{adminTokenErrMsg}</small>
                                        </Form.Text>
                                    </Form.Group>
                                )}
                                <Button
                                    disabled={isDisable}
                                    className={`mt-3 w-100 ${isDisable && "pointer-events-none"}`}
                                    variant="dark"
                                    type="submit"
                                >
                                    Sign Up
                                </Button>
                            </Form>
                            <div className="mt-3 text-center">
                                Already have an account?
                                <Link to="/login" className="mx-2 text-primary">Login</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
