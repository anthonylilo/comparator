import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../../assets/styles/header.css";
import DarkToggler from "./darkToggler/themeToggler";

function SubNavbar() {
  return (
    <Navbar expand="lg" className="sub-header">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-around"
          id="basic-navbar-nav"
        >
          <Nav>
            <Nav.Item>
              <a
                className="text-center "
                href="/comparator/url-status-checker"
                rel="noopener noreferrer"
              >
                URL Status Checker
              </a>
            </Nav.Item>
            <Nav.Item>
              <a
                className="text-center "
                href="/comparator/seo-checker"
                rel="noopener noreferrer"
              >
                SEO Checker
              </a>
            </Nav.Item>
            <Nav.Item>
              <a className="text-center " href="#" rel="noopener noreferrer">
              Matrix Mirror
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
