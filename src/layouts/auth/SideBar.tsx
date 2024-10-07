import React from 'react';
import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    CodepenOutlined,
    DeploymentUnitOutlined,
    ProductOutlined,
    SettingOutlined,
    UnorderedListOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import sideBarStyles from './layout.module.scss'
import {useLocation, useNavigate} from "react-router-dom";

import {Layout, Menu, theme} from "antd";
import {useAuth} from "../../hooks/useAuth.tsx";

const {Header, Sider, Content} = Layout;
export const Sidebar = ({collapsed}: { collapsed: boolean }) => {

    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const openSubMenuKeys = [];

    switch (location.pathname) {
        case "/admin/users":
            openSubMenuKeys.push('/admin/users')
            break;
        case "/admin/categories":
            openSubMenuKeys.push('categories')
            break;
        case "/vendor/products":
        case "/vendor/products/create":
        case "/vendor/products/out-of-stock":
            openSubMenuKeys.push('products')
            break;
        default:
    }

    const adminRoutes = [
        {
            key: "/admin/dashboard",
            icon: <AppstoreOutlined/>,
            label: 'Dashboard',
            onClick: () => navigate("/admin/dashboard")
        },
        {
            key: "/admin/users",
            icon: <UsergroupAddOutlined/>,
            label: 'User Management',
            onClick: () => navigate("/admin/users")
        },
        {
            key: '/admin/categories',
            icon: <DeploymentUnitOutlined/>,
            label: 'Category',
            onClick: () => navigate("/admin/categories")
        },
        {
            key: '/admin/products',
            icon: <ProductOutlined/>,
            label: 'Product',
            onClick: () => navigate("/admin/products")
        },
        // {
        //     key: '3',
        //     icon: <SettingOutlined/>,
        //     label: 'Profile',
        // },
    ]
    const vendorRoutes = [
        {
            key: "/vendor/dashboard",
            icon: <AppstoreOutlined/>,
            label: 'Dashboard',
            onClick: () => navigate("/vendor/dashboard")
        },
        {
            key: 'products',
            icon: <ProductOutlined/>,
            label: 'Product',
            children: [
                {
                    key: "/vendor/products/create",
                    icon: <AppstoreAddOutlined/>,
                    label: 'Add Product',
                    onClick: () => navigate("/vendor/products/create")
                },
                {
                    key: "/vendor/products",
                    icon: <UnorderedListOutlined/>,
                    label: 'All Products',
                    onClick: () => navigate("/vendor/products")
                },
                {
                    key: "/vendor/products/out-of-stock",
                    icon: <CodepenOutlined/>,
                    label: 'Out Of Stock',
                    onClick: () => navigate("/vendor/products/out-of-stock")
                },
            ]
        },
        {
            key: 'orders',
            icon: <ProductOutlined/>,
            label: 'Order',
            children: [
                {
                    key: "/vendor/orders",
                    icon: <UnorderedListOutlined/>,
                    label: 'Manage Orders',
                    onClick: () => navigate("/vendor/orders")
                },
                {
                    key: "/vendor/orders/create",
                    icon: <CodepenOutlined/>,
                    label: 'Add Order',
                    onClick: () => navigate("/vendor/orders/create")
                },
            ]
        },
        // {
        //     key: '3',
        //     icon: <SettingOutlined/>,
        //     label: 'Profile',
        // },
    ]

    const getRoutes = (role: string) => {
        switch (role) {
            case "admin":
                return adminRoutes;
            case "vendor":
                return vendorRoutes;
        }
    }
    const {token: {colorBgContainer, borderRadiusLG},} = theme.useToken();
    return (
        <Sider
            style={{background: colorBgContainer}}
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={sideBarStyles.siderStyle}
            breakpoint="lg"
            collapsedWidth="70"
        >
            <div className={sideBarStyles.siderLogo}/>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                defaultOpenKeys={openSubMenuKeys}
                style={{borderRight: 0}}
                items={getRoutes(user!.role)}
            />
        </Sider>
    );
};
