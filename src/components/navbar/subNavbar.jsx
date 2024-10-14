import {
    Navbar,
    Nav,
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
              <Nav.Link href="#redirections" rel="noopener noreferrer" className="text-center">Redirection Validation</Nav.Link> 
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className="text-center"
                href="#urlStatus"
                rel="noopener noreferrer"
                >
                Https Status Checker
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className="text-center"
                href="#metaTags"
                rel="noopener noreferrer"
                >
                MetaData Checker
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className="text-center"
                href="#"
                rel="noopener noreferrer"
              >
                Text Comparator
              </Nav.Link>
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
  