import React, {useState} from 'react';
import {Alert, Card, notification} from 'antd';
import {Col, Row} from "react-bootstrap";
import Marquee from "react-fast-marquee";

import ProductSaveForm from "./Partials/SaveForm.tsx";
import {ProductService} from "../../../../services/ProductService.ts";
import {CreateProductData} from "../../../../types/models/product.ts";

const CreateProduct = () => {
    const [api, contextHolder] = notification.useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const handleCreateProduct = async (data: CreateProductData) => {
        try {
            setLoading(true)
            const result = await ProductService.createProduct(data);
            if (!result.success) {
                setError(result.message);
            } else {
                // TODO
                return true;
            }
        } catch (err: any) {
            console.log(err)

            api.open({
                message: err.message,
                //description: "Something went wrong!",
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
            <Col md={8}>
                <Card title="Product Information">
                    <Alert
                        banner
                        message="Warning"
                        className="mb-4"
                        description={
                            <Marquee play={false} pauseOnHover gradient={false}>
                                Avoid selling counterfeit products / violating Intellectual Property Rights, so that
                                your products are not deleted.
                            </Marquee>
                        }
                    />
                    <ProductSaveForm<CreateProductData> onSubmit={handleCreateProduct}/>
                </Card>
            </Col>
        </Row>


    );
};

export default CreateProduct;