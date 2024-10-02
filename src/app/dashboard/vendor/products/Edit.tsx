import React, {useEffect, useState} from 'react';
import {Alert, Card, message, notification} from 'antd';
import {Col, Row} from "react-bootstrap";
import Marquee from "react-fast-marquee";

import ProductSaveForm from "./Partials/SaveForm.tsx";
import {ProductService} from "../../../../services/ProductService.ts";
import {Product, UpdateProductData} from "../../../../types/models/product.ts";
import {useParams} from "react-router-dom";

const UpdateProduct = () => {
    const {id} = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    const [api, contextHolder] = notification.useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch product by ID when component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductService.getProductById(id!);  // Fetch the product using id
                setProduct(response.data);  // Set the fetched product
            } catch (err) {
                setError('Failed to load product.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleUpdateProduct = async (data: UpdateProductData) => {

        try {
            setLoading(true)
            const result = await ProductService.updateProduct(data, id!);
            if (!result.success) {
                setError(result.message);
            } else {
                // TODO
                message.success(result.message)
                return true;
            }
        } catch (err: any) {
            console.log(err)

            api.open({
                message: err.response.data.message || err.response.data.title || err.message,
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
            {contextHolder}
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
                    {product ? (
                        <ProductSaveForm<UpdateProductData>
                            isEditForm={true}
                            product={product}
                            onSubmit={handleUpdateProduct}
                        />
                    ) : null}
                </Card>
            </Col>
        </Row>


    );
};

export default UpdateProduct;