import React, {useEffect, useState} from 'react';
import {Button, Card, Input, message, Modal, Select, Table, TableProps, Tag} from "antd";
import {Order, OrderStatus, statusColors} from "../../../../types/models/Order.ts";
import {OrderService} from "../../../../services/OrderService.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {Role} from "../../../../enums/auth.ts";

const {TextArea} = Input;

const ManageOrders = ({isAdmin}: { isAdmin?: boolean }) => {

    const {user} = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusChanging, setStatusChanging] = useState<boolean>(false);
    const [cancelNoteVisible, setCancelNoteVisible] = useState<boolean>(false);
    const [cancelNote, setCancelNote] = useState<string>('');
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());
    const [error, setError] = useState<string | null>(null);

    const [searchText, setSearchText] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);

    const filteredOrders = orders.filter(order =>
        order.orderNumber?.includes(searchText) &&
        (statusFilter ? order.status === statusFilter : true)
    );

    const role: Role = isAdmin ? Role.admin : Role.csr;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const result = await OrderService.getAllOrders(role, axiosController);
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
                    <div className="d-flex flex-column justify-content-start align-items-start gap-3">
                        {(user!.role === Role.admin || user!.role === Role.csr) && (
                            <>
                                <Select<OrderStatus>
                                    defaultValue={order.status}
                                    style={{width: 120}}
                                    placeholder="Select order status"
                                    onChange={(status) => changeStatus(status, order)}
                                    disabled={statusChanging || order.status == OrderStatus.Cancelled || order.status == OrderStatus.Delivered}
                                    options={[
                                        {value: OrderStatus.Pending, label: <span>{OrderStatus.Pending}</span>},
                                        {value: OrderStatus.Processing, label: <span>{OrderStatus.Processing}</span>},
                                        {value: OrderStatus.Shipped, label: <span>{OrderStatus.Shipped}</span>},
                                        {
                                            value: OrderStatus.PartiallyDelivered,
                                            label: <span>{OrderStatus.PartiallyDelivered}</span>
                                        },
                                        {value: OrderStatus.Delivered, label: <span>{OrderStatus.Delivered}</span>},
                                        {value: OrderStatus.Cancelled, label: <span>{OrderStatus.Cancelled}</span>},
                                    ]}
                                />
                                {(user!.role === Role.admin || user!.role === Role.csr)
                                    && (order.status != OrderStatus.Cancelled
                                        && order.status != OrderStatus.Delivered
                                        && order.status != OrderStatus.Shipped) && (
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => handleCancelOrder(order)}
                                            size="small"
                                        >
                                            Cancel Order
                                        </Button>
                                    )}
                            </>
                        )}
                    </div>
                )
            },
        },
        {
            title: "Order Number",
            dataIndex: "orderNumber",
            key: "orderNumber"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, order) => (<Tag color={statusColors[order.status]}>{order.status}</Tag>)
        },
        {title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount"},
        {title: "Shipping Fee", dataIndex: "shippingFee", key: "shippingFee"},
        {title: "Order Date", dataIndex: "orderDate", key: "orderDate"},
        {title: "Note", dataIndex: "note", key: "note"},
        isAdmin ? {
            title: "Vendor",
            dataIndex: "vendorInfo.name",
            key: "vendorInfo",
            render: (_, order) => order.vendorInfo?.name ?? "-"
        } : {hidden: true},
        {
            title: "Items",
            key: "items",
            render: (_, order) => (
                <Table
                    dataSource={order.items}
                    pagination={false}
                    columns={[
                        {
                            title: "Product",
                            dataIndex: "productId",
                            key: "productId",
                            render: (_, item) => <span id={item.productId}>Product</span>
                        },
                        {
                            title: "Item Status",
                            key: "itemStatus",
                            render: (_, item) => (
                                (role == Role.admin)
                                && (order.status !== OrderStatus.Delivered
                                    && order.status !== OrderStatus.Cancelled)
                                    || (item.status !== OrderStatus.Delivered
                                    && item.status !== OrderStatus.Cancelled) ? <Select<OrderStatus>
                                    defaultValue={item.status}
                                    style={{width: 150}}
                                    onChange={(status) => changeItemStatus(status, item, order)}
                                    disabled={item.status === OrderStatus.Delivered || item.status === OrderStatus.Cancelled}
                                    options={[
                                        {value: OrderStatus.Pending, label: 'Pending'},
                                        {value: OrderStatus.Processing, label: 'Processing'},
                                        {value: OrderStatus.Shipped, label: 'Shipped'},
                                        {value: OrderStatus.Delivered, label: 'Delivered'},
                                    ]}
                                /> : <Tag color={statusColors[item.status]}>{item.status}</Tag>
                            )
                        }
                    ]}
                    rowKey="productId"
                />
            )
        }
    ];

    const changeStatus = async (status: OrderStatus, order: Order) => {
        setStatusChanging(true);
        if (status === OrderStatus.Cancelled) {
            handleCancelOrder(order);
            setStatusChanging(false);
            return;
        } else {
            try {
                const result = await OrderService.updateOrderStatus(role, order.id, status);
                if (result.success) {
                    message.success(result.message);
                    setOrders(prevOrders =>
                        prevOrders.map(o =>
                            o.id === order.id ? {...o, status: status} : o
                        )
                    );
                }
            } catch (e) {
                let error = 'Error updating order status';
                if (e?.response?.data?.message) {
                    error = e?.response?.data?.message;
                }
                message.error(error);
            } finally {
                setStatusChanging(false);
            }
        }
    };

    const changeItemStatus = async (status: OrderStatus, item: any, order: Order) => {
        try {
            const result = await OrderService.updateOrderItemStatus(order.id, item.productId, status, role);
            if (result.success) {
                message.success(result.message);
                setOrders((prevOrders: Order[]) =>
                    prevOrders.map(o =>
                        o.id === order.id ? {
                            ...o,
                            items: o.items.map(i =>
                                i.productId === item.productId ? {...i, status} : i
                            )
                        } : o
                    )
                );
            }
        } catch (e) {
            let error = 'Error updating item status';
            if (e?.response?.data?.message) {
                error = e?.response?.data?.message;
            }
            message.error(error);
        }
    };

    const handleCancelOrder = (order: Order) => {
        setOrderToCancel(order);
        setCancelNoteVisible(true);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        if (!cancelNote || cancelNote.length < 6) {
            message.error("Cancelling note is required");
            return;
        }
        try {
            const result = await OrderService.cancelOrder(orderToCancel.id, cancelNote, role);
            if (result.success) {
                message.success(result.message);
                setOrders(prevOrders => prevOrders.map(o => o.id === orderToCancel.id ? {
                    ...o,
                    status: OrderStatus.Cancelled
                } : o));
            }
        } catch (e) {
            let error = 'Error cancelling order';
            if (e?.response?.data?.message) {
                error = e?.response?.data?.message;
            }
            message.error(error);
        } finally {
            setCancelNoteVisible(false);
            setCancelNote('');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <Card loading={loading} title="Manage Orders">
            <div className="d-flex justify-content-between mb-3">
                <Input
                    placeholder="Search by order number"
                    value={searchText}
                    onChange={handleSearch}
                    style={{width: 200}}
                />
                <Select<OrderStatus>
                    style={{width: 200}}
                    placeholder="Filter by status"
                    onChange={setStatusFilter}
                    allowClear
                    options={[
                        {value: OrderStatus.Pending, label: 'Pending'},
                        {value: OrderStatus.Processing, label: 'Processing'},
                        {value: OrderStatus.Shipped, label: 'Shipped'},
                        {value: OrderStatus.PartiallyDelivered, label: 'Partially Delivered'},
                        {value: OrderStatus.Delivered, label: 'Delivered'},
                        {value: OrderStatus.Cancelled, label: 'Cancelled'},
                    ]}
                />
            </div>
            <Table<Order> rowKey="id" columns={columns} dataSource={filteredOrders}/>
            <Modal
                title="Cancel Order"
                visible={cancelNoteVisible}
                onOk={confirmCancelOrder}
                onCancel={() => setCancelNoteVisible(false)}
            >
                <TextArea
                    rows={4}
                    placeholder="Enter cancellation note..."
                    value={cancelNote}
                    onChange={e => setCancelNote(e.target.value)}
                    required
                />
            </Modal>
        </Card>
    );
};

export default ManageOrders;
