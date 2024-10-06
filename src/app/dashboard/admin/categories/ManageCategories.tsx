import React, {useEffect, useState} from 'react';
import {Button, Card, Image, message, Popconfirm, Table, TableProps, Tag, Tooltip} from "antd";
import {Category} from "../../../../types/models/category.ts";
import fallback from "../../../../assets/falback.png"
import {Role} from "../../../../enums/auth.ts";
import {useAuth} from "../../../../hooks/useAuth.tsx";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {CategoryService} from "../../../../services/CategoryService.ts";
import axios from "axios";
import {Container} from "react-bootstrap";

const ManageCategories = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([])
    const [axiosController, setAxiosController] = useState(new AbortController());

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const result = await CategoryService.all(axiosController);
                if (isMounted) {
                    if (!result.success) {
                        setError(result.message);
                    }
                    setCategories(result.data);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) {
                    setAxiosController(new AbortController());
                    console.log("Request canceled", err.message);
                } else if (isMounted) {
                    setError("Something went wrong!");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        let isMounted = true;

        fetchCategories();

        return () => {
            isMounted = false;
            axiosController.abort("Component unmounted");
        };
    }, [axiosController]);

    const columns: TableProps<Category>['columns'] = [
        {
            title: 'Action',
            key: 'operation',
            fixed: 'left',
            width: 100,
            render: (_, category) => {
                return (
                    <div className="d-flex gap-2">
                        {user!.role === Role.admin && (
                            <>
                                <Tooltip title="Edit category">
                                    <Button
                                        type="link"
                                        className="bg-warning text-dark"
                                        // href={`/vendor/categories/${category.id}/edit`}
                                        icon={<EditOutlined/>}
                                        size="small"
                                        onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                                    />
                                </Tooltip>
                                <Popconfirm
                                    title="Delete the category!"
                                    description="Are you sure to delete this category?"
                                    onConfirm={(e) => confirmDelete(e, category)}
                                    onCancel={() => message.error('Delete canceled!')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Tooltip title="Delete The Category">
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
                    </div>
                )
            },
        },
        {
            title: "Image", dataIndex: "image", key: "image", width: 100, render: (_, category) =>
                (
                    <Image
                        src={category.image}
                        width={80}
                        height={80}
                        fallback={fallback}
                    />
                )
        },
        {title: "Name", dataIndex: "name", key: "name",},
        {
            title: "Is Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (_, category) => <Tag color={category.isActive ? 'green' : 'default'}>
                {category.isActive ? "Active" : "InActive"}
            </Tag>
        },
    ]

    const confirmDelete = (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined, category: Category) => {
        e?.preventDefault()
        return new Promise((resolve, reject) => {
            CategoryService.delete(category.id)
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
        <Container>
            <Card loading={loading} title="Manage Products"
                  extra={<Button type="primary" onClick={() => navigate('/admin/categories/create')}>
                      Add Category
                  </Button>}>
                <Table<Category> rowKey="id" columns={columns} dataSource={categories}/>
            </Card>
        </Container>
    );
};

export default ManageCategories;