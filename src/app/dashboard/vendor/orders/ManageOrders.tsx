import React, {useEffect, useState} from 'react';
import {Button, Card, message, Popconfirm, Select, Table, TableProps, Tag, Tooltip} from "antd";
import {Order, OrderStatus, statusColors} from "../../../../types/models/Order.ts";
import {OrderService} from "../../../../services/OrderService.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {Role} from "../../../../enums/auth.ts";

const ManageOrders = ({isAdmin}: { isAdmin?: boolean }) => {

    const {user} = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusChanging, setStatusChanging] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const result = await OrderService.getAllOrders(axiosController, isAdmin);
                if (isMounted) {
                    if (!result.success) {
                        setError(result.message);
                    }
                    setOrders(result.data);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    setAxiosController(new AbortController());
                    console.error("Request canceled", err.message);
                } else if (isMounted) {
                    setError("Something went wrong!");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        let isMounted = true;

        fetchOrders();

        return () => {
            isMounted = false;
            axiosController.abort("Component unmounted");
        };
    }, [axiosController]);

    const columns: TableProps<Order>['columns'] = [
        {
            title: 'Action',
            key: 'operation',
            fixed: 'left',
            render: (_, order) => {
                return (
                    <div className="d-flex justify-content-evenly">
                        {user!.role === Role.vendor && (
                            <>
                                <Tooltip title="Edit order">
                                    <Button
                                        type="link"
                                        className="bg-warning text-dark"
                                        icon={<EditOutlined/>}
                                        size="small"
                                        onClick={() => navigate(`/vendor/orders/${order.id}/edit`)}
                                    />
                                </Tooltip>
                                <Popconfirm
                                    title="Delete the order!"
                                    description="Are you sure to delete this order?"
                                    onConfirm={(e) => confirmDelete(e, order)}
                                    onCancel={() => message.error('Delete canceled!')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Tooltip title="Delete The Order">
                                        <Button
                                            type="primary"
                                            color="danger"
                                            danger
                                            icon={<DeleteOutlined/>}
                                            size="small"
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            </>
                        )}
                        {user!.role === Role.admin && (
                            <>
                                <Select<OrderStatus>
                                    defaultValue={order.status}
                                    style={{width: 120}}
                                    placeholder="Select order status"
                                    onChange={(status) => changeStatus(status, order)}
                                    disabled={statusChanging}
                                    options={[
                                        {value: OrderStatus.Pending, label: <span>{OrderStatus.Pending}</span>},
                                        {value: OrderStatus.Processing, label: <span>{OrderStatus.Processing}</span>},
                                        {value: OrderStatus.Shipped, label: <span>{OrderStatus.Shipped}</span>},
                                        {value: OrderStatus.Delivered, label: <span>{OrderStatus.Delivered}</span>},
                                        {value: OrderStatus.Cancelled, label: <span>{OrderStatus.Cancelled}</span>},
                                    ]}
                                />
                            </>
                        )}
                    </div>
                )
            },
        },
        isAdmin ? {
            title: "Vendor",
            dataIndex: "vendorInfo.name",
            key: "vendorInfo",
            render: (_, order) => order.vendorInfo?.name ?? "-"
        } : {hidden: true},
        {title: "Order Number", dataIndex: "orderNumber", key: "orderNumber"},
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, order) => (<Tag color={statusColors[order.status]}>{order.status}</Tag>)
        },
        {title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount"},
        {title: "Shipping Fee", dataIndex: "shippingFee", key: "shippingFee"},
        {title: "Order Date", dataIndex: "orderDate", key: "orderDate"},
    ];

    const changeStatus = async (status: OrderStatus, order: Order) => {
        setStatusChanging(true);
        try {
            const result = await OrderService.updateOrderStatus(order.id, status);
            if (result.success) {
                message.success(result.message);
                setOrders(prevOrders =>
                    prevOrders.map(o =>
                        o.id === order.id ? {...o, status: status} : o
                    )
                );
            }
        } catch (e) {
            message.error('Error updating order status');
        } finally {
            setStatusChanging(false);
        }
    };

    const confirmDelete = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, order: Order) => {
        e?.preventDefault();
        return new Promise((resolve, reject) => {
            OrderService.deleteOrder(order.id)
            .then(result => {
                if (result.success) message.success(result.message);
                resolve(null);
            })
            .catch(e => {
                message.error(e.response.data.message || e.response.data.title || "Something went wrong");
                reject(e.response.data.message || e.response.data.title || "Something went wrong");
            })
            .finally(() => {
                setAxiosController(new AbortController()); // to refresh the data
            });
        });
    };

    return (
        <Card loading={loading} title="Manage Orders">
            <Table<Order> rowKey="id" columns={columns} dataSource={orders}/>
        </Card>
    );
};

export default ManageOrders;
