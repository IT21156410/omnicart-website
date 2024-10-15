import React from 'react';
import Menu from '../../components/landing-components/Menu';
import Footer from '../../components/landing-components/Footer';

const Contact = () => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Menu/>
            <div style={{flex: 1, padding: '2rem 0'}}>
                <div className="container mt-5 mb-5">
                    <h2 className="text-center mb-4">Contact Us</h2>
                    <p className="lead text-center">
                        If you have any questions or concerns, feel free to contact us.
                    </p>
                    <ul className="list-unstyled text-center">
                        <li className="mb-2"><strong>Email:</strong> support@ominicart.com</li>
                        <li className="mb-2"><strong>Phone:</strong> +94 76 6171525</li>
                        <li className="mb-2"><strong>Address:</strong> 123 Main St, Galle, Sri Lanka.</li>
                    </ul>
                </div>
            </div>
            <Footer style={{marginTop: 'auto'}}/>
        </div>
    );
};

export default Contact;
