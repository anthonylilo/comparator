import {
  Navbar,
  Nav,
  Button,
  Form,
  Image,
  Container,
} from "react-bootstrap";
import "../../assets/header.css";

function HomeNavbar() {
  return (
    <Navbar expand="lg" className="header" >
      <Container fluid>
        <Navbar.Brand href="./">Nestlé Sync Box</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
              <Form.Select aria-label="Default select example">
                <option>Select the project</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </Nav.Item>
            <Nav.Item>
              <a
                className="text-center btn btn-primary"
                href="https://cors-anywhere.herokuapp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Enable the api :D
              </a>
            </Nav.Item>
          </Nav>
          <Nav>
            <Image
              className="float-end"
              src="https://i.ibb.co/wRw4ZLh/NSB-Squad.jpg"
              fluid
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default HomeNavbar;
