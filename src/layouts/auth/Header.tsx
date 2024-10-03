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

    const handleLogout = async () => {
        await logout();
    };

    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();

    return (
        <Header style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
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
            <div style={{marginLeft: 'auto', marginRight: '16px'}}>
                <Button
                    type="default"
                    onClick={handleLogout}
                >
                    <strong>
                        <i className="bi bi-box-arrow-in-right text-dark" style={{fontSize: '24px'}}></i>
                    </strong>
                </Button>
            </div>
        </Header>
    );
};
