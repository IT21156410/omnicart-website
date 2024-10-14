import React, {useEffect, useState} from 'react';
import {Accordion, Dropdown, FormControl, InputGroup, Table} from 'react-bootstrap';

import {User} from "../../../../types";
import {Card, message, notification, Switch, Tag, Tooltip} from 'antd';

import {UserService} from "../../../../services/UserService.ts";
import axios from "axios";

const UserManagement = () => {
    const [api, contextHolder] = notification.useNotification();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());

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
                    <th>Actions</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Account Status</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
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