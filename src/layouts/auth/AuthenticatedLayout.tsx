import {Navigate, useOutlet} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.tsx";
import {HeaderLayout} from "./Header.tsx";
import {useState} from "react";
import {Breadcrumb, Layout, theme} from "antd";
import {Content} from "antd/es/layout/layout";
import {Sidebar} from "./SideBar.tsx";

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
            <Layout style={{marginInlineStart: 200}}>
                <HeaderLayout collapsed={collapsed} setCollapsed={setCollapsed}/>
                <Breadcrumb
                    className="ms-3"
                    items={[{title: 'Home'}, {title: 'Dashboard'}]}
                    style={{margin: '16px 0'}}
                />
                <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: "74vh",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >  {outlet}
                    </div>
                </Content>
                <Layout.Footer style={{textAlign: 'center'}}>
                    OmniCart ©{new Date().getFullYear()}
                </Layout.Footer>
            </Layout>
        </Layout>

    );
};
