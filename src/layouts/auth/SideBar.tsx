import React from 'react';
import {AppstoreOutlined, SettingOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import sideBarStyles from './layout.module.scss'
import {useLocation, useNavigate} from "react-router-dom";

import {Layout, Menu, theme} from "antd";

const {Header, Sider, Content} = Layout;
export const Sidebar = ({collapsed}: { collapsed: boolean }) => {
    const navigate = useNavigate();
    const location = useLocation();

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
                style={{borderRight: 0}}
                items={[
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
                        key: '3',
                        icon: <SettingOutlined/>,
                        label: 'Profile',
                    },
                ]}
            />
        </Sider>
    );
};
