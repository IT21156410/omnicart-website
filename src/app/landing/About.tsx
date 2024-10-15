import React from 'react';
import Menu from '../../components/landing-components/Menu';
import Footer from '../../components/landing-components/Footer';

const About = () => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Menu/>
            <div style={{flex: 1, padding: '2rem 0'}}>
                <div className="container mt-5 mb-5">
                    <h2 className="text-center mb-4">About Us</h2>
                    <p className="lead text-center">
                        Welcome to OminiCart, your one-stop shop for a wide range of products.
                    </p>
                    <p className="text-center">
                        Our mission is to provide our customers with the best shopping experience, offering quality
                        products at affordable prices.
                    </p>
                    <p className="text-center">
                        We are committed to excellent customer service and are here to assist you with any questions or
                        concerns.
                    </p>
                </div>
            </div>
            <Footer style={{marginTop: 'auto'}}/>
        </div>
    );
};

export default About;
