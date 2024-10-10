import { Container, Row, Col, Form } from "react-bootstrap";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";
import SubNavbar from "../components/navbar/subNavbar";

export default function HttpChecker({}) {
  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container>
        <h1>Https Status Checker</h1>
      </Container>
      <VerticalButtons />
    </>
  );
}
