import React, {useEffect, useState} from 'react';
import {Button, Card, Rate, Table, TableProps, Tag} from "antd";
import {Review} from "../../../../types/models/Review.ts";
import axios from "axios";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {UserService} from "../../../../services/UserService.ts";
import {Role} from "../../../../enums/auth.ts";
import {Col, Row} from "react-bootstrap";
import {CancelRequest} from "../../../../types/models/CancelRequest.ts";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {getCurrentDateTime} from "../../../../utils/date-time.ts";

const ManageRatings = ({isAdmin}: { isAdmin?: boolean }) => {

    const {user} = useAuth();

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

    const handleGenerateReport = () => {
        generatePDF(reviews);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    return (
        <Card
            loading={loading}
            title={
                <>
                    <div className="d-flex justify-content-between">
                        <span>Manage Ratings</span>
                        <Button className="mb-2 ms-4" type="primary" onClick={handleGenerateReport}>
                            Generate PDF Report
                        </Button>
                    </div>
                </>
            }
        >
            <Row style={{marginBottom: '20px'}} className="d-flex justify-content-around">
                <Col>
                    <h4>Average Rating: {averageRating !== 'N/A' ? averageRating : 'No ratings available'}</h4>
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

            <Table<Review> rowKey="id" columns={columns} dataSource={reviews}/>
        </Card>
    );
};

const generatePDF = (reviews: Review[]) => {
    const doc = new JsPDF({ orientation: "landscape" });

    // Title of the document
    doc.setFontSize(18);
    doc.text('Vendor Reviews Report', 14, 22);

    // Calculate the average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 'N/A';

    // Add average rating
    doc.setFontSize(14);
    doc.text(`Average Rating: ${averageRating}`, 14, 32);

    // Create the table
    const tableData = reviews.map((review) => [
        review.customerId,
        review.rating.toFixed(1),
        review.comment || '-',
        new Date(review.createdAt).toLocaleString(),
        review.updatedAt ? new Date(review.updatedAt).toLocaleString() : '-',
    ]);

    autoTable(doc, {
        head: [['Customer ID', 'Rating', 'Comment', 'Created At', 'Updated At']],
        body: tableData,
        startY: 40,
    });

    // Save the PDF
    doc.save(`vendor_reviews_report-${getCurrentDateTime()}.pdf`);
};

export default ManageRatings;
