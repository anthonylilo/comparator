import React from "react";
import { Container } from "react-bootstrap";
import HomeNavbar from "../components/navbar/HomeNavbar";
import SubNavbar from "../components/navbar/SubNavbar";

export default function Redirection({}) {
  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container>
        <h1>URL Status Checker</h1>
      </Container>
    </>
  );
}
