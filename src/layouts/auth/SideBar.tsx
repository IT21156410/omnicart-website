import React from 'react';
import Sider from "antd/es/layout/Sider";
import {Menu, theme} from "antd";
import {AppstoreOutlined, SettingOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import sideBarStyles from './layout.module.scss'
import {useLocation, useNavigate} from "react-router-dom";

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
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                // console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                // console.log(collapsed, type);
            }}
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
