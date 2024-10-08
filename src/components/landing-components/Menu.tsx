import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import ModalContact from './ModalContact';
import {Link, useNavigate} from "react-router-dom";

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
            <img id="logo" src={"/omni-cart.webp"} alt="OminiCart Logo" width={100} height={100} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className='text-center justify-content-end'>
            <Nav className="justify-content-center">
              <Nav.Link href="/" style={{ color: '#272b38', fontWeight: 'bold' }}>Home</Nav.Link>
              <Nav.Link href="#products" style={{ color: '#272b38', fontWeight: 'bold' }}>Products</Nav.Link>
              <Nav.Link href="#promocoes" style={{ color: '#272b38', fontWeight: 'bold' }}>Promotions</Nav.Link>
              <Nav.Link href="#about" style={{ color: '#272b38', fontWeight: 'bold' }}>About Us</Nav.Link>
              <Nav.Link href="#contact" style={{ color: '#272b38', fontWeight: 'bold' }}>Contact</Nav.Link>
              <Nav.Link href="#faq" style={{ color: '#272b38', fontWeight: 'bold' }}>FAQ</Nav.Link>

              <Button
                  variant='warning'
                  className='ms-2 me-5 h-25'
                  onClick={() => setModalShow(true)}
                  style={{ backgroundColor: '#ffcc00', borderColor: '#ffcc00' }}
              >
                Request Quote
              </Button>
              {!user ? (
                  <Button
                      variant='primary'
                      className='mx-2 h-25'
                      onClick={() => navigate("/login")}
                      style={{ backgroundColor: '#000106', borderColor: '#000106' }}
                  >
                    Login
                  </Button>
              ) : (
                  <>
                    {user && token &&
                        <Button
                            variant='danger'
                            className='mx-2 h-25'
                            onClick={() => navigate(`/${user.role}/dashboard`)}
                            style={{ backgroundColor: '#000106', borderColor: '#000106' }}
                        >
                          Dashboard
                        </Button>
                    }
                    <Button
                        variant='danger'
                        className='mx-2 h-25'
                        onClick={handleLogout}
                        style={{ backgroundColor: '#000106', borderColor: '#000106' }}
                    >
                      Logout
                    </Button>
                  </>
              )}
              <ModalContact show={modalShow} onHide={() => setModalShow(false)} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}
