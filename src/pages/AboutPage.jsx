import React, { useEffect } from "react";
import HomeNavbar from '../components/navbar/HomeNavbar.jsx';
import HomeCarousel from '../components/carousel/HomeCarousel.jsx';
import { Row, Container, Col } from 'react-bootstrap';
import '../assets/styles/styles.css'
import '../assets/styles/home.css'
import Dropdowns from '../components/home-dropdowns/Dropdowns.jsx';
import ThemeToggler from "../components/navbar/darkToggler/ThemeToggler.jsx";
export default function AboutPage(className = "home") {
  useEffect(() => {
    document.documentElement.setAttribute("data-project", "home");
  }, []);
  return (
    <>
    <HomeNavbar />
    <Container>
        <div className="containerWrapper">
          <h1 className="brandBackgroundHeading">NSB</h1>
          <Container className="card-wrapper" >
            <Row className="card--inner-wraper">
              <Col className="home-left" md={7}>
                <HomeCarousel />
              </Col>
              <Col className="home-right d-flex align-items-end" md={5}>
                <ThemeToggler />
                <Dropdowns />
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}
