import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {User} from "../../../../../types";

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
        role: string;
        setRole: (role: string) => void;
    }
}) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedUser ? 'Edit User' : 'Add New User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formUserName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter user name"
                            //defaultValue={selectedUser?.name || ''}
                            value={state.name}
                            onChange={(e) => state.setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUserEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            //defaultValue={selectedUser?.email || ''}
                            value={state.email}
                            onChange={(e) => state.setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUserRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            //defaultValue={selectedUser?.role || 'admin'}
                            value={state.role}
                            onChange={(e) => state.setRole(e.target.value)}>
                            <option value="admin">Administrator</option>
                            <option value="vendor">Vendor</option>
                            <option value="csr">CSR</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveUser}>
                    {selectedUser ? 'Save Changes' : 'Add User'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaveModal;