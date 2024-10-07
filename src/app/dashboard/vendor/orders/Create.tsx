import React, {useState} from 'react';
import {Alert, Card, message, notification} from 'antd';
import {Col, Row} from "react-bootstrap";
import Marquee from "react-fast-marquee";
import OrderSaveForm from "./Partials/SaveForm.tsx";
import {OrderService} from "../../../../services/OrderService.ts";
import {CreateOrderData} from "../../../../types/models/order.ts";

const CreateOrder = () => {

    const [api, contextHolder] = notification.useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleCreateOrder = async (data: CreateOrderData) => {
        try {
            setLoading(true);
            const result = await OrderService.createOrder(data);
            if (!result.success) {
                setError(result.message);
            } else {
                message.success(result.message);
                return true;
            }
        } catch (err: any) {
            console.error(err);

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
                                Please ensure all order details are accurate before submission.
                            </Marquee>
                        }
                    />
                    <OrderSaveForm<CreateOrderData> onSubmit={handleCreateOrder} loading={loading} />
                </Card>
            </Col>
        </Row>
    );
};

export default CreateOrder;
