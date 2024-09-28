import {Navigate, useOutlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";
import {HeaderLayout} from "./Header.tsx";
import {useState} from "react";
import {Breadcrumb, Layout, theme} from "antd";

import {Sidebar} from "./SideBar.tsx";

const {Content} = Layout;

export const ProtectedLayout = () => {
    const {user, is2FAVerified} = useAuth();
    const outlet = useOutlet();

    const [collapsed, setCollapsed] = useState(false);
    const {token: {colorBgContainer, borderRadiusLG},} = theme.useToken();

    if (!user) {
        return <Navigate to="/"/>;
    }

    if (!is2FAVerified) {
        return <Navigate to="/verify-2fa"/>;
    }
    return (
        <Layout hasSider>
            <Sidebar collapsed={collapsed}/>
            <Layout>
                <HeaderLayout collapsed={collapsed} setCollapsed={setCollapsed}/>
                <Breadcrumb
                    className="ms-3"
                    items={[{title: 'Home'}, {title: 'Dashboard'}]}
                    style={{margin: '16px 0'}}
                />
                <Content style={{margin: '0 16px 0', overflow: 'initial'}}>
                    <div
                        style={{
                            padding: '10px 16px 20px',
                            minHeight: "74vh",
                            // background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >  {outlet}
                    </div>
                </Content>
                <Layout.Footer style={{background: colorBgContainer,textAlign: 'center'}}>
                    OmniCart ©{new Date().getFullYear()}
                </Layout.Footer>
            </Layout>
        </Layout>

    );
};
