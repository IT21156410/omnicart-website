import React from 'react';
import {Card, Col, Row} from 'antd';
import Menu from '../../components/landing-components/Menu';
import Footer from '../../components/landing-components/Footer';

const Promotions = () => {

    const promotions = [
        {id: 1, title: "Buy 1, Get 1 Free", details: "Available on select items."},
        {id: 2, title: "20% Off on All Orders", details: "Use code SAVE20 at checkout."},
    ];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Menu/>
            <div
                style={{
                    flex: 1,
                    padding: '2rem 0',
                }}
            >
                <div className="container mt-5 mb-5">
                    <h2 className="text-center mb-4">Current Promotions</h2>
                    <Row gutter={[16, 16]} justify="center">
                        {promotions.map(promo => (
                            <Col key={promo.id} xs={24} sm={12} md={8}>
                                <Card
                                    title={promo.title}
                                    bordered={false}
                                    className="shadow-sm text-center"
                                    hoverable
                                >
                                    <p>{promo.details}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
            <Footer
                style={{
                    marginTop: 'auto',
                }}
            />
        </div>
    );
};

export default Promotions;
