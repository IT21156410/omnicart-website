import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Category, UpdateCategoryData} from "../../../../types/models/category.ts";
import {Alert, Card, message, notification} from "antd";
import {CategoryService} from "../../../../services/CategoryService.ts";
import {Col, Row} from "react-bootstrap";
import Marquee from "react-fast-marquee";
import CategorySaveForm from "./partials/SaveForm.tsx";

const EditCategory = () => {
    const {id} = useParams<{ id: string }>();
    const [category, setCategory] = useState<Category | null>(null);

    const [api, contextHolder] = notification.useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await CategoryService.getCategoryById(id!);  // Fetch the product using id
                setCategory(response.data);  // Set the fetched product
            } catch (err) {
                setError('Failed to load product.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleUpdate = async (data: UpdateCategoryData) => {

        try {
            setLoading(true)
            const result = await CategoryService.update(data, id!);
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
                <Card title="Category Information">
                    {category ? (
                        <CategorySaveForm
                            isEditForm={true}
                            category={category}
                            onSubmit={handleUpdate}
                        />
                    ) : null}
                </Card>
            </Col>
        </Row>


    );
};

export default EditCategory;