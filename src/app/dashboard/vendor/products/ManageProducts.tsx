import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Form,
    Image,
    Input,
    message,
    Modal,
    Popconfirm,
    Select,
    Table,
    TableProps,
    Tag,
    Tooltip
} from "antd";
import {Product, ProductStatus, statusColors} from "../../../../types/models/product.ts";
import {ProductService} from "../../../../services/ProductService.ts";
import axios from "axios";
import fallback from "../../../../assets/falback.png"
import {useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {Role} from "../../../../enums/auth.ts";
import {Accordion, InputGroup} from 'react-bootstrap';
import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {getCurrentDateTime} from "../../../../utils/date-time.ts";

const generatePDF = (products: Product[]) => {
    const doc = new JsPDF({orientation: "landscape",});

    // Title of the document
    doc.setFontSize(18);
    doc.text('Product Report', 14, 22);

    // Create the table
    const tableData = products.map((product) => [
        product.name,
        product.status,
        product.category?.name ?? "-", // Assuming category object has a name
        product.condition,
        product.stock.toString(),
        product.sku,
        product.price.toString(),
        product.discount.toString(),
        product.shippingFee.toString(),
    ]);

    autoTable(doc, {
        head: [['Product Name', 'Status', 'Category', 'Condition', 'Stock', 'SKU', 'Price', 'Discount', 'Shipping']],
        body: tableData,
        startY: 30,
    });

    // Save the PDF
    doc.save(`product_report-${getCurrentDateTime()}.pdf`);
};

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
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Filter states
    const [searchName, setSearchName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "">("");
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

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
                    setFilteredProducts(result.data);
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

    // Filter products based on search and other filters
    useEffect(() => {
        let filtered = products;

        // Filter by name
        if (searchName) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter((product) => product.categoryId === selectedCategory);
        }

        // Filter by status
        if (selectedStatus) {
            filtered = filtered.filter((product) => product.status === selectedStatus);
        }

        // Filter by price range
        if (minPrice !== null) {
            filtered = filtered.filter((product) => product.price >= minPrice);
        }
        if (maxPrice !== null) {
            filtered = filtered.filter((product) => product.price <= maxPrice);
        }

        setFilteredProducts(filtered);
    }, [searchName, selectedCategory, selectedStatus, minPrice, maxPrice, products]);

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
                setFilteredProducts(products)
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

    const handleGenerateReport = () => {
        generatePDF(products);
    };

    return (
        <Card loading={loading} title="Manage Products">
            {/* Filter Inputs */}
            <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Filters</Accordion.Header>
                    <Accordion.Body>
                        <InputGroup className="mb-3">
                            <Form layout="inline">
                                <Form.Item>
                                    <Input
                                        type="text"
                                        placeholder="Search by name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Input
                                        type="number"
                                        placeholder="Min Price"
                                        value={minPrice !== null ? minPrice : ''}
                                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Input
                                        type="number"
                                        placeholder="Max Price"
                                        value={maxPrice !== null ? maxPrice : ''}
                                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(value) => setSelectedCategory(value)}
                                    >
                                        <Select.Option value="">All Categories</Select.Option>
                                        {/* Add your category options here */}
                                        {
                                            Array.from(new Set(products.map(product => product.categoryId)))
                                                .map(categoryId => (
                                                    <Select.Option
                                                        key={categoryId}
                                                        value={categoryId}
                                                    >
                                                        {products.find(p => p.categoryId === categoryId)?.category?.name}
                                                    </Select.Option>)
                                                )
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Select<ProductStatus | "">
                                        value={selectedStatus}
                                        onChange={(value, option) => setSelectedStatus(value)}
                                    >
                                        <Select.Option value="">All Statuses</Select.Option>
                                        <Select.Option value={ProductStatus.Pending}>Pending</Select.Option>
                                        <Select.Option value={ProductStatus.Active}>Active</Select.Option>
                                        <Select.Option value={ProductStatus.Inactive}>Inactive</Select.Option>
                                        <Select.Option value={ProductStatus.Rejected}>Rejected</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>


                        </InputGroup>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Button className="mb-2" type="primary" onClick={handleGenerateReport}>
                Generate PDF Report
            </Button>
            <Table<Product> rowKey="id" columns={columns} dataSource={filteredProducts}/>
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