import React, {ChangeEventHandler, useEffect, useState} from 'react';
import {Alert, Card, Divider} from 'antd';
import {Button, FloatingLabel, Form, } from 'react-bootstrap';
import {EditOutlined} from '@ant-design/icons';
import {CreateOrderData, UpdateOrderData, Order} from "../../../../../types/models/order.ts";
import '../../../../../components/rich-text-editor/ckeditor.css';
import {useNavigate} from "react-router-dom";
import {ProductService} from "../../../../../services/ProductService.ts";
import {UserService} from "../../../../../services/UserService.ts";

type SaveFormPropsBase<T> = {
    onSubmit: (data: T) => Promise<boolean | undefined>;
};

type SaveFormProps<T> = SaveFormPropsBase<T> & (
    | { isEditForm: true; order: Order }
    | { isEditForm?: false; order?: undefined }
    );

const OrderSaveForm = <T extends CreateOrderData | UpdateOrderData>({
                                                                        isEditForm,
                                                                        order,
                                                                        onSubmit
                                                                    }: SaveFormProps<T>) => {

    const initialData = {
        ...(order ? order : {}),
        userId: order?.userId || "",
        status: order?.status || "",
        products: order?.items || [],
        shippingAddress: order?.shippingAddress || "",
        totalAmount: order?.totalAmount || "",
    } as T;

    const navigate = useNavigate();

    const [formData, setFormData] = useState<T>(initialData);
    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState<boolean>(true);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCustomersAndProducts = async () => {
            try {
                setLoadingCustomers(true);
                const customerResult = await UserService.getAllUsers();
                if (customerResult.success) {
                    setCustomers(customerResult.data);
                }
                setLoadingCustomers(false);

                setLoadingProducts(true);
                const productResult = await ProductService.getAllProducts();
                if (productResult.success) {
                    setProducts(productResult.data);
                }
                setLoadingProducts(false);
            } catch (error) {
                setLoadingCustomers(false);
                setLoadingProducts(false);
            }
        };

        if (isMounted) {
            fetchCustomersAndProducts();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await onSubmit(formData);
        if (result) {
            if (!isEditForm) {
                setFormData(initialData);
                navigate("/vendor/orders/");
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="customerId" label="Customer" className="mb-3">
                <Form.Select
                    aria-label="Customer"
                    value={formData.userId}
                    onChange={handleInputChange}
                >
                    <option>Select Customer</option>
                    {loadingCustomers && <option>Loading...</option>}
                    {
                        !loadingCustomers && customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))
                    }
                </Form.Select>
            </FloatingLabel>

            <FloatingLabel controlId="status" label="Order Status" className="mb-3">
                <Form.Select
                    aria-label="Order Status"
                    value={formData.status}
                    onChange={handleInputChange}
                >
                    <option value="">Choose Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                </Form.Select>
            </FloatingLabel>

            <Card title="Order Products" type="inner" className="mb-3">
                <Alert
                    className="mb-4"
                    type="info"
                    showIcon
                    message="Tips"
                    description="Select the products that are part of this order."
                />

                <Form.Group className="mb-3">
                    <Form.Label>Products</Form.Label>
                    <Form.Select multiple>
                        {loadingProducts && <option>Loading...</option>}
                        {!loadingProducts && products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name} - {product.price} LKR
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Card>

            <FloatingLabel controlId="shippingAddress" label="Shipping Address" className="mb-3">
                <Form.Control
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    as="textarea"
                    placeholder="Enter Shipping Address"
                    rows={3}
                />
            </FloatingLabel>

            <FloatingLabel controlId="totalAmount" label="Total Amount (LKR)" className="mb-3">
                <Form.Control
                    type="number"
                    placeholder="Enter Total Amount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                />
            </FloatingLabel>

            <Divider dashed />

            <Button variant="primary" type="submit" className="px-5 py-2">
                <EditOutlined /> {isEditForm ? 'Update Order' : 'Create Order'}
            </Button>
        </Form>
    );
};

export default OrderSaveForm;
