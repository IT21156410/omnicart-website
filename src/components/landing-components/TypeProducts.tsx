import React, { useEffect, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap';
import {CategoryService} from "../../services/CategoryService.ts";
import {Category} from "../../types/models/category.ts";

const TypeProducts = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await CategoryService.allActive();
                setCategories(response.data);
            } catch (error) {
                setError('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <Row className='d-flex justify-content-around text-center my-5'>
                {categories.map(category => (
                    <Col key={category.id} className='my-4'>
                        <img
                            src={category.image || 'default-image-path'}
                            alt={category.name}
                            width={100}
                            height={100}
                            className='border rounded-circle p-2'
                        />
                        <h6 className='text-success mt-2'>{category.name}</h6>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TypeProducts;
