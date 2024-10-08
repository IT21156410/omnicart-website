import {Col, Row} from "react-bootstrap";
import {Suspense} from "react";
import {Card, Skeleton} from "antd";
import {useAuth} from "../../hooks/useAuth.tsx";
import corporatePng from "../../assets/corporate.png"

const Dashboard = () => {
    const {user: authUser} = useAuth();

    return (
        <>
            <Row gutter={25}>
                <Col xs={24}>
                    <Suspense
                        fallback={
                            <Card>
                                <Skeleton active/>
                            </Card>
                        }
                    >
                        <Card style={{padding: "30px 40px", backgroundColor: "rgb(32, 36, 68)"}}>
                            <figure style={{position: "relative", minHeight: 180}}>

                                <img src={corporatePng} alt="img" style={{
                                    position: "absolute",
                                    bottom: "50%",
                                    marginBottom: -80,
                                    maxWidth: 240,
                                    right: 30,
                                }}/>
                                <figcaption>
                                    <h2 className="mb-4" style={{fontSize: 30, fontWeight: 600, color: "#ffffff",}}>
                                        {`Welcome To ${authUser?.role.toLocaleUpperCase()} Dashboard : ${authUser?.name || 'Default user'}`}
                                    </h2>
                                    <p style={{
                                        fontSize: 15,
                                        maxWidth: 610,
                                        opacity: 1,
                                        marginBottom: 25,
                                        color: "#ffffff",
                                    }}>
                                        Manage everything
                                    </p>

                                </figcaption>
                            </figure>
                        </Card>

                    </Suspense>
                </Col>
                <Col xxl={8} xl={10} xs={24}>
                    <Suspense
                        fallback={
                            <Card>
                                <Skeleton active/>
                            </Card>
                        }
                    >
                        {/*<Calender />*/}
                    </Suspense>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;