import React from 'react';
import Menu from '../../components/landing-components/Menu';
import Footer from '../../components/landing-components/Footer';

const FAQ = () => {

    const faqs = [
        {
            id: 1,
            question: "How can I place an order?",
            answer: "You can place an order through our website or mobile app."
        },
        {
            id: 2,
            question: "What payment methods do you accept?",
            answer: "We accept Visa, MasterCard, PayPal, and bank transfers."
        },
        {
            id: 3,
            question: "Can I track my order?",
            answer: "Yes, you can track your order in the 'Order History' section."
        },
    ];

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Menu/>
            <div style={{flex: 1, padding: '2rem 0'}}>
                <div className="container mt-5 mb-5">
                    <h2 className="text-center mb-4">Frequently Asked Questions</h2>
                    <ul className="list-group">
                        {faqs.map(faq => (
                            <li key={faq.id} className="list-group-item mb-3">
                                <h5 className="font-weight-bold">{faq.question}</h5>
                                <p>{faq.answer}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer style={{marginTop: 'auto'}}/>
        </div>
    );
};

export default FAQ;
