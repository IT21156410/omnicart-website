import React, {FormEventHandler, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";
import {Container, Row, Col, Form, Button, Card, Alert} from "react-bootstrap";
import {useNotification} from "../../hooks/useNotification.tsx";

export const Verify2FAPage = () => {

    const navigate = useNavigate();
    const {verify2FACode} = useAuth();
    const {addNotification} = useNotification();

    const [code, setCode] = useState<string>("");
    const [codeErrMsg, setCodeErrMsg] = useState<string>('');
    const [errors, setErrors] = useState<string | null>(null);
    const [isDisable, setIsDisable] = useState<boolean>(false);

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
            const isValid = await verify2FACode(code);
            if (isValid) {
                addNotification("Two-step verification is successful", "success", "Success");
                navigate("/admin/dashboard");
            } else {
                setErrors("Invalid code. Please try again.");
            }
        } catch (error) {
            setErrors("An error occurred while verifying the code. Please try again.");
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
                            <h2 className="text-center mb-4">Two Factor Authentication</h2>
                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="verificationCode" className="mb-3">
                                    <Form.Label>Verification Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Enter verification code"
                                    />
                                    <Form.Text className="text-danger">
                                        <small>{codeErrMsg}</small>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    className={`w-100 ${isDisable && "pointer-events-none"}`}
                                    variant="dark"
                                    disabled={isDisable}
                                >
                                    Verify
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
