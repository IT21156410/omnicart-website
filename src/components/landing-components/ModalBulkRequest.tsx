import React from 'react';
import {Modal, Form, Input, Button} from 'antd';

export default function ModalBulkRequest(props) {

    const {show, onHide} = props;

    const onFinish = (values) => {
        console.log('Bulk Request Form values:', values);
        onHide();
    };

    return (
        <Modal
            visible={show}
            title="Request for Bulk Products"
            onCancel={onHide}
            footer={null}
            centered
            style={{padding: '20px'}}
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: 'Please enter your name!'}]}
                >
                    <Input placeholder="Enter your name"/>
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true, type: 'email', message: 'Please enter a valid email!'}]}
                >
                    <Input placeholder="Enter your email"/>
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{required: true, message: 'Please enter your phone!'}]}
                >
                    <Input placeholder="Enter your phone number"/>
                </Form.Item>
                <Form.Item
                    label="Message"
                    name="message"
                    rules={[{required: true, message: 'Please enter your message!'}]}
                >
                    <Input.TextArea rows={4} placeholder="Enter your message"/>
                </Form.Item>
                <Form.Item>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button type="primary" htmlType="submit" className="bg-dark app-dark-btn">
                            Send Request
                        </Button>
                    </div>
                </Form.Item>
            </Form>
            <div style={{textAlign: 'center'}}>
                <p>Thank you for reaching out! We will get back to you soon.</p>
            </div>
        </Modal>
    );
}
