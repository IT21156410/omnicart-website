import React from 'react';
import Sider from "antd/es/layout/Sider";
import {Menu} from "antd";
import {UploadOutlined, UserOutlined, VideoCameraOutlined} from "@ant-design/icons";
import sideBarStyles from './layout.module.scss'

export const Sidebar = ({collapsed}: { collapsed: boolean }) => {
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={sideBarStyles.siderStyle}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className={sideBarStyles.siderLogo}/>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{borderRight: 0}}
                items={[
                    {
                        key: '1',
                        icon: <UserOutlined/>,
                        label: 'Dashboard',
                    },
                    {
                        key: '2',
                        icon: <VideoCameraOutlined/>,
                        label: 'Profile',
                    },
                    {
                        key: '3',
                        icon: <UploadOutlined/>,
                        label: 'Products',
                    },
                ]}
            />
        </Sider>
    );
};
