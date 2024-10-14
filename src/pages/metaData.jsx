import { Container, Row, Col, Form } from "react-bootstrap";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";
import SubNavbar from "../components/navbar/subNavbar";

export default function MetaData({}) {
  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container>
        <h1>MetaData Checker</h1>
      </Container>
      <VerticalButtons />
    </>
  );
}
