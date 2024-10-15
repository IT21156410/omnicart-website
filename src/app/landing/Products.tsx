import React from 'react';
import {Card, Col, Row} from 'antd';
import Menu from '../../components/landing-components/Menu';
import Footer from '../../components/landing-components/Footer';

const {Meta} = Card;

const Products = () => {

    const sampleProducts = [
        {
            id: 1,
            name: "Product A",
            description: "Description of Product A",
            price: "Rs.200",
            image: "https://via.placeholder.com/150"
        },
        {
            id: 2,
            name: "Product B",
            description: "Description of Product B",
            price: "Rs.400",
            image: "https://via.placeholder.com/150"
        },
        {
            id: 3,
            name: "Product C",
            description: "Description of Product C",
            price: "Rs.600",
            image: "https://via.placeholder.com/150"
        },
    ];

    return (
        <>
            <Menu/>
            <>
                <div className="container mt-5 mb-5">
                    <h2 className="text-center mb-4">Our Products</h2>
                    <Row gutter={[16, 16]} justify="center">
                        {sampleProducts.map(product => (
                            <Col key={product.id} xs={24} sm={12} md={8}>
                                <Card
                                    hoverable
                                    cover={<img alt={product.name} src={product.image}/>}
                                    className="shadow-sm"
                                >
                                    <Meta
                                        title={product.name}
                                        description={product.description}
                                    />
                                    <div className="mt-3">
                                        <strong>{product.price}</strong>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </>
            <Footer
                style={{
                    marginTop: 'auto',
                }}
            />
        </>
    );
};

export default Products;
