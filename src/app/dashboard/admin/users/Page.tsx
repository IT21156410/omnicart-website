import React, {useEffect, useState} from 'react';
import {Accordion, Button, Dropdown, FormControl, InputGroup, Table} from 'react-bootstrap';

import {User} from "../../../../types";
import {Card} from 'antd';
import SaveModal from "./Patials/SaveModal.tsx";
import {UserService} from "../../../../services/UserService.ts";
import axios from "axios";

const UserManagement = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [axiosController, setAxiosController] = useState(new AbortController());

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await UserService.getAllUsers(axiosController);
                if (isMounted) {
                    if (!result.success) {
                        setError(result.message);
                    }
                    setUsers(result.data);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    setAxiosController(new AbortController());
                    console.log("Request canceled", err.message);
                } else if (isMounted) setError("Something went wrong!");
            } finally {
                if (isMounted) setLoading(false);
            }
        };


        let isMounted = true;

        fetchUsers();

        return () => {
            isMounted = false;
            axiosController.abort("Component unmounted");
        };
    }, [axiosController]);

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
        <Card
            title="User Management"
            extra={<Button variant="primary" onClick={handleAddUser}>
                Add User
            </Button>}>

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
        </Card>
    );
};

export default UserManagement;