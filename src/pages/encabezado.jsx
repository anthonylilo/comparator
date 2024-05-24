import { Navbar, Nav, NavDropdown, Button, Image, Row, Container, Col } from 'react-bootstrap';
import '../assets/header.css'

  function Encabezado() {

    const handleReset = () => {
      window.location.reload();
    };
    return (
     <Container className='header' fluid>
      <Row>
        <Col md={6}>
        <Navbar  expand="lg">
        <Navbar.Brand href="#home">Nestlé Sync Box</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Select Project" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ml-auto">
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
          <a
            className="text-center btn btn-primary"
            href="https://cors-anywhere.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Activar la api :D
          </a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
        </Col>
        <Col className='banner' md={{ span: 6}}>
        <Image className='float-end' src="https://i.ibb.co/wRw4ZLh/NSB-Squad.jpg" fluid />
        </Col>
      </Row>
     </Container>
    );
  }
export default Encabezado;