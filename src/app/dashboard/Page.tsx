import {Button, Card, Col, Row} from "react-bootstrap";

const Dashboard = () => {

    return (
        <>
            <Row>
                <Col md={4}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Earnings</Card.Title>
                            <Card.Text className="fs-3">$63,438.78</Card.Text>
                            <Button variant="primary">Download</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Customers</Card.Title>
                            <Card.Text className="fs-4">39,354</Card.Text>
                            <span className="text-danger">-9%</span>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Products</Card.Title>
                            <Card.Text className="fs-4">4,396</Card.Text>
                            <span className="text-success">+23%</span>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Sales</Card.Title>
                            <Card.Text className="fs-4">423,39</Card.Text>
                            <span className="text-success">+38%</span>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Refunds</Card.Title>
                            <Card.Text className="fs-4">835</Card.Text>
                            <span className="text-danger">-12%</span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;