// src/pages/AboutPage.jsx
import { useState, useEffect } from "react";
import HomeNavbar from '../components/navbar/homeNavbar';
import HomeCarousel from '../components/carousel/carousel.jsx';
import { Row, Container, Col,  } from 'react-bootstrap';
import '../assets/styles/styles.css'
import '../assets/styles/home.css'
import SubNavbar from "../components/navbar/subNavbar.jsx";
export default function AboutPage(className = "home") {
  useEffect(() => {
    document.documentElement.setAttribute("data-project", "home");
  }, []);
  return (
    <>
    <HomeNavbar />
    <SubNavbar></SubNavbar>
    <Container>
        <div className="containerWrapper">
          <h1 className="brandBackgroundHeading">NSB</h1>
          <Container className="card-wrapper" >
            <Row>
              <Col className="home-left" md={7}>
                <HomeCarousel />
              </Col>
              <Col className="home-right" md={5}>
                <h3>Tools:</h3>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}
