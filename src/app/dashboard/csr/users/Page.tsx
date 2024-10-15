import React, {useEffect, useState} from 'react';
import {Accordion, InputGroup, Table} from 'react-bootstrap';

import {User} from "../../../../types";
import {Button, Card, Checkbox, Form, Input, message, notification, Select, Switch, Tag, Tooltip} from 'antd';

import {UserService} from "../../../../services/UserService.ts";
import axios from "axios";
import {Role} from "../../../../enums/auth.ts";
import {generatePDF} from "../../common/users/generatePdf.ts";

const UserManagement = () => {
    const [api, contextHolder] = notification.useNotification();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


    // Filter states
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isActive, setIsActive] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const result = await UserService.getAllUsers(axiosController);
                if (isMounted) {
                    if (!result.success) {
                        setError(result.message);
                    }
                    setUsers(result.data);
                    setFilteredUsers(result.data);
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

// Filter users based on search and other filters
    useEffect(() => {
        let filtered = users;

        // Filter by name
        if (searchName) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Filter by email
        if (searchEmail) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
        }

        // Filter by role
        if (selectedRole) {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        // Filter by active status
        if (isActive !== null) {
            filtered = filtered.filter(user => user.isActive === isActive);
        }

        setFilteredUsers(filtered);
    }, [searchName, searchEmail, selectedRole, isActive, users]);

    const onChangeProductStatus = async (user: User, checked: boolean) => {
        try {
            const result = await UserService.updateUserStatus(user!.id!, checked);
            if (result.success) {
                message.success(result.message);
                setAxiosController(new AbortController());
            }
        } catch (e) {
            message.error('Error updating user status');
        } finally {
        }
    };


    const handleGenerateReport = () => {
        generatePDF(users);
    };

    return (
        <Card
            loading={loading}
            title="User Management">
            {contextHolder}
            {/* Search and Role Filter */}
            <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Filters</Accordion.Header>
                    <Accordion.Body>
                        <InputGroup className="mb-3">
                            <Form layout="inline">
                                <Form.Item>
                                    <Input
                                        placeholder="Search by name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Input
                                        placeholder="Search by email"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Select<Role | null>
                                        placeholder="Select Role"
                                        value={selectedRole}
                                        onChange={(value) => setSelectedRole(value)}
                                        style={{width: '200px'}}
                                    >
                                        <Select.Option value={null}>All Roles</Select.Option>
                                        <Select.Option value={Role.admin}>Admin</Select.Option>
                                        <Select.Option value={Role.vendor}>Vendor</Select.Option>
                                        <Select.Option value={Role.csr}>CSR</Select.Option>
                                        <Select.Option value={Role.customer}>Customer</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item>
                                    <Checkbox
                                        checked={isActive === true}
                                        onChange={(e) => setIsActive(e.target.checked ? true : null)}
                                    >
                                        Active
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Checkbox
                                        checked={isActive === false}
                                        onChange={(e) => setIsActive(e.target.checked ? false : null)}
                                    >
                                        Inactive
                                    </Checkbox>
                                </Form.Item>
                            </Form>
                        </InputGroup>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Button className="mb-2" type="primary" onClick={handleGenerateReport}>
                Generate PDF Report
            </Button>

            {/* User Table */}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Actions</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Account Status</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <div className="d-flex gap-2">
                                <Tooltip title="Approve/Deactivate this user account">
                                    <Switch value={user.isActive}
                                            onChange={(value) => onChangeProductStatus(user, value)}/>
                                </Tooltip>
                            </div>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.isActive ? <Tag color="success">Activated</Tag> :
                            <Tag color="red">Not Activated</Tag>}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Card>
    );
};

export default UserManagement;