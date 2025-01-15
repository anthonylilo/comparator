import React from "react";

import {
  Navbar,
  Nav,
  Image,
  Container,
} from "react-bootstrap";
import "../../assets/styles/header.css";
import { useLocation } from "react-router-dom"; // Import useLocation
import BrandPicker from "./styleToggler/brandPicker";
import "../navigatonButtons/TooltipButton.css";

function HomeNavbar() {
  return (
    <Navbar expand="lg" className="header">
      <Container fluid>
        <Navbar.Brand href="/comparator">Nestlé Sync Box</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-between" id="basic-navbar-nav">
          <Nav>
            <Nav.Item>
            {location.pathname !== "/comparator" && <BrandPicker />}
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
