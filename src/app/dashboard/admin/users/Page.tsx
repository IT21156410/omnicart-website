import React, {useEffect, useState} from 'react';
import {Accordion, Button, Col, Container, Dropdown, FormControl, InputGroup, Row, Table} from 'react-bootstrap';

import {User} from "../../../../types";
import {Typography} from 'antd';
import SaveModal from "./Patials/SaveModal.tsx";

const UserManagement = () => {

    const [users, setUsers] = useState<User[]>([
        {id: 1, name: 'John Doe', email: 'admin@example.com', role: 'admin'},
        {id: 2, name: 'Jane Vendor', email: 'vendor@example.com', role: 'vendor'},
        {id: 3, name: 'Sam CSR', email: 'csr@example.com', role: 'csr'}
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');

    // When editing a user, populate the form with the selected user's details
    useEffect(() => {
        if (selectedUser) {
            setName(selectedUser.name);
            setEmail(selectedUser.email);
            setRole(selectedUser.role);
        } else {
            // Reset the form when adding a new user
            setName('');
            setEmail('');
            setRole('admin');
        }
    }, [selectedUser]);

    const handleAddUser = () => setShowModal(true);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setShowModal(true);
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Add or update user logic
    const handleSaveUser = () => {
        if (selectedUser) {
            // Edit existing user
            const updatedUsers = users.map(user =>
                user.id === selectedUser.id ? {...user, name, email, role} : user
            );
            setUsers(updatedUsers);
        } else {
            // Add new user
            const newUser: User = {
                id: Math.random(), // Assign unique ID (you can use a better ID generation strategy)
                name,
                email,
                role
            };
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };
    return (
        <div>
            <Container fluid={true}>
                <Row>
                    <Col md={4}>
                        <Typography.Title level={3}>User Management</Typography.Title>
                    </Col>
                    <Col md={{span: 4, offset: 4}} className="text-end">
                        {/* Add User Button */}
                        <Button variant="primary" onClick={handleAddUser} className="mb-3">
                            Add User
                        </Button>
                    </Col>
                </Row>
            </Container>

            {/* Search and Role Filter */}
            <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Filters</Accordion.Header>
                    <Accordion.Body>
                        <InputGroup className="mb-3">
                            <FormControl placeholder="Search Users..."/>
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                    Filter by Role
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">All</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Administrator</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Vendor</Dropdown.Item>
                                    <Dropdown.Item href="#/action-4">CSR</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </InputGroup>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {/* User Table */}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>
                                Edit
                            </Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <SaveModal
                handleCloseModal={handleCloseModal}
                selectedUser={selectedUser}
                showModal={showModal}
                handleSaveUser={handleSaveUser}
                state={{name, setName, email, setEmail, role, setRole,}}/>
        </div>
    );
};

export default UserManagement;