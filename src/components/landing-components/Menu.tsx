import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import {useNavigate} from "react-router-dom";
import ModalBulkRequest from "./ModalBulkRequest.tsx";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import { Button as ButtonAntd } from 'antd';

export default function Menu() {

  const navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const { user, token, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
      <Navbar style={{ backgroundColor: '#f8f9fa' }} expand="md" width="100%">
        <Container>
          <Navbar.Brand href="/">
            <img id="logo" src={"/omnicart-logo-txt.webp"} alt="OminiCart Logo" width={200} height="auto" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className='text-center justify-content-end'>
            <Nav className="justify-content-center align-items-center">
              <Nav.Link href="/" style={{ color: '#272b38', fontWeight: 'bold' }}>Home</Nav.Link>
              <Nav.Link href="/products" style={{ color: '#272b38', fontWeight: 'bold' }}>Products</Nav.Link>
              <Nav.Link href="/promotions" style={{ color: '#272b38', fontWeight: 'bold' }}>Promotions</Nav.Link>
              <Nav.Link href="/about" style={{ color: '#272b38', fontWeight: 'bold' }}>About Us</Nav.Link>
              <Nav.Link href="/contact" style={{ color: '#272b38', fontWeight: 'bold' }}>Contact</Nav.Link>
              <Nav.Link href="/faq" style={{ color: '#272b38', fontWeight: 'bold' }}>FAQ</Nav.Link>

              <ButtonAntd
                  type="primary"
                  className='ms-2 me-2 h-25'
                  onClick={() => setModalShow(true)}
                  style={{ backgroundColor: '#ffcc00', borderColor: '#ffcc00' }}
              >
                Request To Bulk
              </ButtonAntd>
              {!user ? (
                  <ButtonAntd
                      type="primary"
                      className="mx-2 h-25 app-dark-btn"
                      onClick={() => navigate("/login")}
                      icon={<LoginOutlined />}
                  >
                    Login
                  </ButtonAntd>
              ) : (
                  <>
                    {user && token &&
                        <ButtonAntd
                            type="primary"
                            className='mx-2 h-25 app-dark-btn'
                            onClick={() => navigate(`/${user!.role}/dashboard`)}
                            style={{ backgroundColor: '#000106', borderColor: '#000106' }}
                        >
                          Dashboard
                        </ButtonAntd>
                    }
                    <ButtonAntd
                        type="primary"
                        className="mx-2 h-25 app-dark-btn"
                        onClick={handleLogout}
                        icon={<LogoutOutlined />}
                    >
                      Logout
                    </ButtonAntd>
                  </>
              )}
              <ModalBulkRequest show={modalShow} onHide={() => setModalShow(false)} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}
