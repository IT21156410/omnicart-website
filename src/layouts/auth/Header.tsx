import React from 'react';
import {useAuth} from "../../hooks/useAuth.tsx";
import {Button, Layout, theme} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

const {Header} = Layout;

export const HeaderLayout = ({collapsed, setCollapsed}: {
    collapsed: boolean,
    setCollapsed: (collapsed: boolean) => void
}) => {
    const {user, logout} = useAuth();

    const handleLogout = () => {
        logout();
    };
    const {token: {colorBgContainer, borderRadiusLG},} = theme.useToken();
    return (
        <Header style={{padding: 0, background: colorBgContainer}}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
        </Header>
    );
};
