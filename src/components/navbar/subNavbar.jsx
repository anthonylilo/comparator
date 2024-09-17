import {
    Navbar,
    Nav,
    Button,
    Form,
    Image,
    Container,
  } from "react-bootstrap";
  import "../../assets/styles/header.css";
import DarkToggler from "./darkToggler/themeToggler";
  
  function SubNavbar() {
    return (
      <Navbar expand="lg" className="sub-header">
        <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-around" id="basic-navbar-nav">
            <Nav>
            <Nav.Item>
                <a
                  className="text-center "
                  href="#"
                  rel="noopener noreferrer"
                >
                  Redirection Validation
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className="text-center "
                  href="#"
                  rel="noopener noreferrer"
                >
                  Https Status Checker
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className="text-center "
                  href="#"
                  rel="noopener noreferrer"
                >
                  MetaData Checker
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className="text-center "
                  href="#"
                  rel="noopener noreferrer"
                >
                  Text Comparator
                </a>
              </Nav.Item>
            </Nav>
            <Nav>
                <DarkToggler></DarkToggler>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  export default SubNavbar;
  