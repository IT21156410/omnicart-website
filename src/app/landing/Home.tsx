import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Menu from '../../components/landing-components/Menu';
import Slider from '../../components/landing-components/Slider';
import TypeProducts from '../../components/landing-components/TypeProducts';
import Newsletter from '../../components/landing-components/Newsletter';
import Footer from '../../components/landing-components/Footer';

import BlackFriDay from "../../assets/img/black-friday.svg";
import {Image} from "antd";

export default function Home() {

    const navigate = useNavigate();

    return (
        <>
            <Menu />
            <Slider />
            <section className="py-5 bg-light">
                <h2 className="text-center" style={{ color: '#0066cc' }}>Explore Product Categories</h2>
                <p className="text-center text-muted">Discover a wide range of products</p>
                <TypeProducts />
            </section>
            <section className="my-5 text-center">
                <div className="bloco-post d-flex align-items-center justify-content-center flex-wrap">
                    <div className="post1 p-3">
                        <Image
                            src={BlackFriDay || "https://via.placeholder.com/300x150"}
                            alt="Black Friday Banner"
                            width={300}
                            height={150}
                            className="rounded"
                        />
                    </div>
                    <div className="post2 text-center p-3">
                        <h4>Exclusive Black Friday Deals</h4>
                        <p>Redecorate and refresh your home with our special offers!</p>
                        <Button variant="dark" size="lg" onClick={() => navigate('#')}>
                            Shop Now
                        </Button>
                    </div>
                </div>
            </section>
            <Newsletter />
            <Footer />
        </>
    );
}
