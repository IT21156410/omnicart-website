import React, {useEffect, useState} from 'react';
import {Button, Card, Image, Input, message, Modal, Popconfirm, Select, Table, TableProps, Tag, Tooltip} from "antd";
import {Product, ProductStatus, statusColors} from "../../../../types/models/product.ts";
import {ProductService} from "../../../../services/ProductService.ts";
import axios from "axios";
import fallback from "../../../../assets/falback.png"
import {useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {Role} from "../../../../enums/auth.ts";


const ManageProducts = ({isAdmin, filterOutOfStock = false}: { isAdmin?: boolean, filterOutOfStock?: boolean }) => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [statusChanging, setStatusChanging] = useState<boolean>(false)
    const [stockChanging, setStockChanging] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [axiosController, setAxiosController] = useState(new AbortController());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const result = await ProductService.getAllProducts(axiosController, {isAdmin, filterOutOfStock});
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
    }, [axiosController, location.pathname]);

    const showStockModal = (product: Product) => {
        setIsModalOpen(true);
        setSelectedProduct(product);
    };

    const saveStock = async () => {
        if (!selectedProduct) return;
        setStockChanging(true);
        try {
            const result = await ProductService.updateProductStock(selectedProduct!.id!, selectedProduct!.stock);
            if (result.success) {
                message.success(result.message);
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.id === result.data.id ? result.data : p
                    )
                );
            }
        } catch (e) {
            message.error('Error updating product stock');
        } finally {
            setStockChanging(false);
            setIsModalOpen(false);
            setSelectedProduct(null);
        }
    };

    const cancelStockEdit = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };


    const columns: TableProps<Product>['columns'] = [
        {
            title: 'Action',
            key: 'operation',
            fixed: 'left',
            render: (_, product) => {
                return (
                    <div className="d-flex gap-2">
                        {user!.role === Role.vendor && (
                            <>
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
                            </>
                        )}
                        {user!.role === Role.admin && (
                            <>
                                <Select<ProductStatus>
                                    defaultValue={product.status}
                                    style={{width: 120}}
                                    placeholder="Select product status"
                                    onChange={(status) => changeStatus(status, product)}
                                    disabled={statusChanging}
                                    options={[
                                        {value: ProductStatus.Pending, label: <span>{ProductStatus.Pending}</span>},
                                        {value: ProductStatus.Active, label: <span>{ProductStatus.Active}</span>},
                                        {value: ProductStatus.Inactive, label: <span>{ProductStatus.Inactive}</span>},
                                        {value: ProductStatus.Rejected, label: <span>{ProductStatus.Rejected}</span>,}, /*disabled:true*/
                                    ]}
                                />
                            </>
                        )}

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
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, product) => (<Tag color={statusColors[product.status]}>{product.status}</Tag>)
        },
        {
            title: "Category",
            dataIndex: "category.name",
            key: "category.name",
            render: (_, product) => product.category?.name ?? "-"
        },
        {title: "Condition", dataIndex: "condition", key: "condition",},
        {
            title: "Stock", dataIndex: "stock", key: "stock", render: (_, product) => (
                <div className="d-inline-flex">
                    {product.stock <= 0 ? <Tag color="red">Out Of Stock</Tag> : product.stock}
                    {user?.role === Role.vendor && <Tooltip title="Manage product item stock"><Button
                        type="link"
                        // href={`/vendor/products/${product.id}/edit`}
                        icon={<EditOutlined/>}
                        size="small"
                        onClick={() => showStockModal(product)}
                    /></Tooltip>}
                </div>
            )
        },
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

    const changeStatus = async (status: ProductStatus, product: Product) => {
        setStatusChanging(true)
        try {
            const result = await ProductService.updateProductStatus(product.id, status);
            if (result.success) {
                message.success(result.message);
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.id === product.id ? {...p, status: status} : p
                    )
                );
            }
        } catch (e) {
            message.error('Error updating product status');
        } finally {
            setStatusChanging(false);
        }
    }

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
            {
                selectedProduct &&
                <Modal title="Manage Stock Items" open={isModalOpen} onOk={saveStock} onCancel={cancelStockEdit}>
                    <Input
                        onChange={(e) => {
                            setSelectedProduct({...selectedProduct!, stock: parseInt(e.target.value)});
                        }}
                        value={selectedProduct.stock}
                        type="number"
                        placeholder="Input a number"
                        maxLength={16}
                    />
                </Modal>
            }

        </Card>
    );
};

export default ManageProducts;