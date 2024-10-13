import React from 'react';
import {useAuth} from "../../hooks/useAuth.tsx";
import {Button, Layout, theme} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import Notifications from "../../components/Notifications.tsx";
import NotificationBellButton from "../../components/NotificationBellButton.tsx";

const {Header} = Layout;

export const HeaderLayout = ({collapsed, setCollapsed}: {
    collapsed: boolean,
    setCollapsed: (collapsed: boolean) => void
}) => {

    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState<boolean>(false);

    const handleLogout = async () => {
        await logout();
    };

    const {token: {colorBgContainer, borderRadiusLG}} = theme.useToken();

    const showDrawer = () => {
        setOpen(true);
    };

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
            <div className="d-flex" style={{marginLeft: 'auto', marginRight: '16px'}}>
                <NotificationBellButton showDrawer={showDrawer}/>
                <Button
                    type="default"
                    onClick={handleLogout}
                    className="mx-1"
                >
                    <strong>
                        <i className="bi bi-box-arrow-in-right text-dark" style={{fontSize: '24px'}}></i>
                    </strong>
                </Button>
                <Button
                    type="default"
                    onClick={() => navigate("/")}
                    className="mx-1"
                >
                    <strong>
                        <i className="bi bi-house text-dark" style={{fontSize: '24px'}}></i>
                    </strong>
                </Button>
            </div>
            <Notifications open={open} setOpen={setOpen}/>
        </Header>
    );
};
