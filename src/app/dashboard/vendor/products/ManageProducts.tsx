import React, {useEffect, useState} from 'react';
import {Card, Image, Table, TableProps} from "antd";
import {Product} from "../../../../types/models/product.ts";
import {ProductService} from "../../../../services/ProductService.ts";
import axios from "axios";
import fallback from "../../../../assets/falback.png"

const ManageProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const result = await ProductService.getAllProducts(axiosController);
                if (isMounted) {
                    if (!result.success) {
                        setError(result.message);
                    }
                    setProducts(result.data);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    setAxiosController(new AbortController());
                    console.log("Request canceled", err.message);
                } else if (isMounted) setError("Something went wrong!");
            } finally {
                if (isMounted) setLoading(false);
            }
        };


        let isMounted = true;

        fetchProducts();

        return () => {
            isMounted = false;
            axiosController.abort("Component unmounted");
        };
    }, [axiosController]);

    const columns: TableProps<Product>['columns'] = [
        {
            title: "Image", dataIndex: "photos", key: "photos", render: (_, product) =>
                (
                    <>
                        {
                            product.photos.slice(0, 1).map((photo, index) => <Image
                                key={index}
                                src={photo}
                                width={80}
                                height={80}
                                fallback={fallback}
                            />)

                        }
                    </>
                )
        },
        {title: "Name", dataIndex: "name", key: "name",},
        {title: "Category", dataIndex: "category", key: "category",},
        {title: "Condition", dataIndex: "condition", key: "condition",},
        {title: "Stock", dataIndex: "stock", key: "stock",},
        {title: "SKU", dataIndex: "sku", key: "sku",},
        {title: "Price (LKR)", dataIndex: "price", key: "price",},
        {title: "Discount (LKR)", dataIndex: "discount", key: "discount",},
        {title: "Shipping Fee (LKR)", dataIndex: "shippingFee", key: "shippingFee",},
        {title: "Weight (G)", dataIndex: "productWeight", key: "productWeight",},
        {
            title: "Size (CM)", key: "size", render: ((_, product) => (
                <div key={`size-${product.id}`}>
                    <div>Width: {product.width} cm</div>
                    <div>Height: {product.height} cm</div>
                    <div>Length {product.length} cm</div>
                </div>
            ))
        },
    ];

    return (
        <Card loading={loading} title="Manage Products">
            <Table<Product> rowKey="id" columns={columns} dataSource={products}/>
        </Card>
    );
};

export default ManageProducts;