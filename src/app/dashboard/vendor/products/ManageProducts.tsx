import React, {useEffect, useState} from 'react';
import {Button, Card, Image, message, Popconfirm, Table, TableProps, Tooltip} from "antd";
import {Product} from "../../../../types/models/product.ts";
import {ProductService} from "../../../../services/ProductService.ts";
import axios from "axios";
import fallback from "../../../../assets/falback.png"
import {useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const ManageProducts = ({isAdmin}: { isAdmin?: boolean }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const result = await ProductService.getAllProducts(axiosController, isAdmin);
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
            title: 'Action',
            key: 'operation',
            fixed: 'left',
            width: 100,
            render: (_, product) => {
                return (
                    <div className="d-flex justify-content-evenly">
                        {/*// {product.can_update_users &&*/}
                        <Tooltip title="Edit product">
                            <Button
                                type="link"
                                className="bg-warning text-dark"
                                // href={`/vendor/products/${product.id}/edit`}
                                icon={<EditOutlined/>}
                                size="small"
                                onClick={() => navigate(`/vendor/products/${product.id}/edit`)}
                            />
                        </Tooltip>
                        {/*// }*/}
                        {/*// {product.can_delete_users &&*/}
                        <Popconfirm
                            title="Delete the product!"
                            description="Are you sure to delete this product?"
                            onConfirm={(e) => confirmDelete(e, product)}
                            onCancel={() => message.error('Delete canceled!')}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Delete The User">
                                <Button
                                    type="primary"
                                    color="danger"
                                    danger
                                    icon={<DeleteOutlined/>}
                                    size="small"
                                />
                            </Tooltip>
                        </Popconfirm>
                        {/*// }*/}
                    </div>
                )
            },
        },
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
        isAdmin ? {
                title: "Vendor",
                dataIndex: "vendorInfo.name",
                key: "vendorInfo",
                render: (_, product) => product.vendorInfo?.name ?? "-"
            } :
            {hidden: true},
        {title: "Name", dataIndex: "name", key: "name",},
        {title: "Status", dataIndex: "status", key: "status",},
        {
            title: "Category",
            dataIndex: "category.name",
            key: "category.name",
            render: (_, product) => product.category?.name ?? "-"
        },
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
                    {product.width} x {product.height} x {product.length} cm
                </div>
            ))
        },
    ];

    const confirmDelete = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, product: Product) => {
        e?.preventDefault()
        return new Promise((resolve, reject) => {
            ProductService.deleteProduct(product.id)
                .then(result => {
                    if (result.success) message.success(result.message);
                    resolve(null)
                })
                .catch(e => {
                    message.error(e.response.data.message || e.response.data.title || "Something went wrong");
                    reject(e.response.data.message || e.response.data.title || "Something went wrong");
                })
                .finally(() => {
                    setAxiosController(new AbortController()); // to refresh the data
                })
        });

    };
    return (
        <Card loading={loading} title="Manage Products">
            <Table<Product> rowKey="id" columns={columns} dataSource={products}/>
        </Card>
    );
};

export default ManageProducts;