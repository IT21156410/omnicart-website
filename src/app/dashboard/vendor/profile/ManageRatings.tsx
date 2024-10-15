import React, { useEffect, useState } from 'react';
import {Card, Rate, Table, TableProps, Tag} from "antd";
import { Review } from "../../../../types/models/Review.ts";
import axios from "axios";
import { useAuth } from "../../../../hooks/useAuth.tsx";
import {UserService} from "../../../../services/UserService.ts";
import {Role} from "../../../../enums/auth.ts";
import {Col, Row} from "react-bootstrap";

const ManageRatings = ({ isAdmin }: { isAdmin?: boolean }) => {

    const { user } = useAuth();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [axiosController, setAxiosController] = useState(new AbortController());
    const [error, setError] = useState<string | null>(null);

    const role: Role = isAdmin ? Role.admin : Role.vendor;

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                setLoading(true);
                const result = await UserService.getAllVendorReviews(role, user!.id, axiosController);
                if (result.success) {
                    setReviews(result.data);
                } else {
                    setError(result.message);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    setAxiosController(new AbortController());
                    console.error("Request canceled", err.message);
                } else {
                    setError("Something went wrong!");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();

        return () => {
            axiosController.abort("Component unmounted");
        };
    }, [axiosController]);

    const columns: TableProps<Review>['columns'] = [
        {
            title: 'Customer ID',
            dataIndex: 'customerId',
            key: 'customerId'
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => (
                <Rate
                    disabled
                    value={parseFloat(rating)}
                    allowHalf
                    tooltips={rating}
                />
            )
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => date ? new Date(date).toLocaleString() : "-"
        }
    ];

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    return (
        <Card loading={loading} title="Manage Ratings">
            <Row style={{ marginBottom: '20px' }} className="d-flex justify-content-around">
                <Col>
                    <h3>Average Rating: {averageRating !== 'N/A' ? averageRating : 'No ratings available'}</h3>
                </Col>
                <Col className="text-end">
                    {averageRating !== 'N/A' && (
                        <Rate
                            disabled
                            value={parseFloat(averageRating)}
                            allowHalf
                        />
                    )}
                </Col>
            </Row>

            <Table<Review> rowKey="id" columns={columns} dataSource={reviews} />
        </Card>
    );
};

export default ManageRatings;
