import {
  Navbar,
  Nav,
  Image,
  Container,
} from "react-bootstrap";
import "../../assets/styles/header.css";
import BrandPicker from "./styleToggler/brandPicker";
import TooltipButton from "../navigatonButtons/TooltipButton";
import "../navigatonButtons/TooltipButton.css";
import EnableIcon from "../../assets/images/enable.svg";

function HomeNavbar() {
  return (
    <Navbar expand="lg" className="header">
      <Container fluid>
        <Navbar.Brand href="./">Nestlé Sync Box</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
              <BrandPicker />
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
