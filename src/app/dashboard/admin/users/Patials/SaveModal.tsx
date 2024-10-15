import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {User} from "../../../../../types";
import {Role} from "../../../../../enums/auth.ts";

const SaveModal = ({selectedUser, showModal, handleCloseModal, handleSaveUser, state}: {
    selectedUser: User | null,
    showModal: boolean,
    handleCloseModal: () => void,
    handleSaveUser: () => void,
    state: {
        name: string;
        setName: (name: string) => void;
        email: string;
        setEmail: (email: string) => void;
        role: Role;
        setRole: (role: Role) => void;
        password: string;
        setPassword: (role: string) => void;
    }
}) => {
    const [validationErrors, setValidationErrors] = useState<Partial<Record<"name" | "email" | "role" | "password", string>>>({})

    function validateFormData() {
        setValidationErrors({})
        let valid = true;
        if (state.name.trim() === "" || state.name.trim().split(" ").length <= 1) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                name: "Please enter user first name and last name"
            }))
            valid = false;
        }

        if (state.email.trim() === "") {
            const errorText = "Please enter the email.";
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                email: errorText
            }))
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
            const errorText = "Please enter a valid email.";
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                email: errorText
            }))
            valid = false;
        }

        if (!selectedUser && state.password === "") {
            const errorText = "Please enter the password.";
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                password: errorText
            }))
            valid = false;
        } else if (!selectedUser && state.password && state.password.toString().length < 8) {
            const errorText = "Password must be at least 8 characters long.";
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                password: errorText
            }))
            valid = false;
        }

        if (state.role.trim() === "") {
            const errorText = "Please select a role.";
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                role: errorText
            }))
            valid = false;
        }
        return valid;
    }

    return (
        <Modal
            show={showModal}
            onHide={() => {
                setValidationErrors({})
                handleCloseModal()
            }}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formUserName">
                        <Form.Label column="sm">Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter user name"
                            //defaultValue={selectedUser?.name || ''}
                            value={state.name}
                            isInvalid={!!validationErrors.name}
                            onChange={(e) => state.setName(e.target.value)}
                        />
                        {validationErrors.name &&
                            <Form.Text className="text-danger">
                                <small>{validationErrors.name}</small>
                            </Form.Text>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUserEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            //defaultValue={selectedUser?.email || ''}
                            value={state.email}
                            isInvalid={!!validationErrors.email}
                            onChange={(e) => state.setEmail(e.target.value)}
                        />
                        {validationErrors.email &&
                            <Form.Text className="text-danger">
                                <small>{validationErrors.email}</small>
                            </Form.Text>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUserRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            //defaultValue={selectedUser?.role || 'admin'}
                            value={state.role}
                            isInvalid={!!validationErrors.role}
                            onChange={(e) => state.setRole(e.target.value as Role)}>
                            <option value={Role.admin}>Administrator</option>
                            <option value={Role.vendor}>Vendor</option>
                            <option value={Role.csr}>CSR</option>
                        </Form.Select>
                        {validationErrors.role &&
                            <Form.Text className="text-danger">
                                <small>{validationErrors.role}</small>
                            </Form.Text>
                        }
                    </Form.Group>
                    {!selectedUser && <Form.Group className="mb-3" controlId="formUserPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            //defaultValue={selectedUser?.password || ''}
                            value={state.password}
                            isInvalid={!!validationErrors.password}
                            onChange={(e) => state.setPassword(e.target.value)}
                        />
                        {validationErrors.password &&
                            <Form.Text className="text-danger">
                                <small>{validationErrors.password}</small>
                            </Form.Text>
                        }
                    </Form.Group>}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    setValidationErrors({})
                    handleCloseModal()
                }}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {
                    if (!validateFormData()) {
                        console.log(validationErrors)
                        return;
                    }
                    handleSaveUser()
                }}>
                    {selectedUser ? 'Save Changes' : 'Add User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaveModal;