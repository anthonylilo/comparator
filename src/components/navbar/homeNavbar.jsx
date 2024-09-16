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


function HomeNavbar() {
  return (
    <Navbar expand="lg" className="header">
      <Container fluid>
        <Navbar.Brand href="./">Nestlé Sync Box</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
              <Form.Select aria-label="Default select example">
                <option>Select the project</option>
                <option value="1">Purina</option>
                <option value="2">Unifier</option>
                <option value="3">Nestlé Professional</option>
              </Form.Select>
            </Nav.Item>
          </Nav>
          <Nav>
            <Image
              className="float-end"
              src="https://i.ibb.co/FWSZ6WG/nsb-png.png"
              fluid
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default HomeNavbar;
