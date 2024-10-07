import React, {useEffect, useState} from 'react';
import {Alert, Card, message, notification} from 'antd';
import {Col, Row} from "react-bootstrap";
import Marquee from "react-fast-marquee";
import OrderSaveForm from "./Partials/SaveForm.tsx";
import {OrderService} from "../../../../services/OrderService.ts";
import {Order, UpdateOrderData} from "../../../../types/models/order.ts";
import {useParams} from "react-router-dom";

const UpdateOrder = () => {

    const {id} = useParams<{ id: string }>();
    const [api, contextHolder] = notification.useNotification();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch order by ID when component mounts
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await OrderService.getOrderById(id!); // Fetch the order using the ID
                setOrder(response.data);
            } catch (err) {
                setError('Failed to load order.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleUpdateOrder = async (data: UpdateOrderData) => {

        try {
            setLoading(true);
            const result = await OrderService.updateOrder(data, id!);
            if (!result.success) {
                setError(result.message);
            } else {
                message.success(result.message);
                return true;
            }
        } catch (err: any) {
            console.log(err);

            api.open({
                message: err.response.data.message || err.response.data.title || err.message,
                showProgress: true,
                pauseOnHover: true,
                type: "error",
            });
            setError("Something went wrong!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row>
            {contextHolder}
            <Col md={8}>
                <Card title="Order Information">
                    <Alert
                        banner
                        message="Warning"
                        className="mb-4"
                        description={
                            <Marquee play={false} pauseOnHover gradient={false}>
                                Ensure all order information is correct before submission.
                            </Marquee>
                        }
                    />
                    {order ? (
                        <OrderSaveForm<UpdateOrderData>
                            isEditForm={true}
                            order={order}
                            onSubmit={handleUpdateOrder}
                        />
                    ) : null}
                </Card>
            </Col>
        </Row>
    );
};

export default UpdateOrder;
