import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <div className='bg-light'>
        <Container className='text-center pt-5 mt-5' style={{fontSize: "10px"}}>
            <Row>
                <Col>
                    <a href="/">
                        <img
                            src={"/omni-cart.webp"}
                            alt="logotipo da Beautiful Home Store"
                            width={150}
                        />
                    </a>
                </Col>
            </Row>
            <p className='py-4'>© 2021 Omini Cart. All rights reserved.</p>
        </Container>
    </div>
  );
};
