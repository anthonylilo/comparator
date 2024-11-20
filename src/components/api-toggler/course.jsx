import React, { useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
export default function AboutPage(){
  return(
    <Row>
      <Col  md={12}>
        <h2 className="text-center">Enable the api</h2>
      </Col>
      <Col md={12}>
        <Button href="https://cors-anywhere.herokuapp.com/">Enable the API</Button>
      </Col>
    </Row>
  )
}