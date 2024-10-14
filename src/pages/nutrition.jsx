import { Container, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import ArticleForm from "../modules/comparator/articleForm";
import Editor from "../modules/editor/editor";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";
import SubNavbar from "../components/navbar/subNavbar";

export default function Nutrition(className="Nutrition") {
  useEffect(() => {
    document.documentElement.setAttribute('data-project', 'unifier');
  }, []);
  const [selectedFormat, setSelectedFormat] = useState("html");

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  return (
    <>
      <HomeNavbar />
      <SubNavbar/>
      <Container>
      <div className="containerWrapper">
      <h1 className="brandBackgroundHeading">Baby and me</h1>
        <Container className="main" fluid>
          <h2 className="text-center">Nestlé Baby and Me</h2>
          <Row className="text-center pt-4 pb-4">
            <h3>Select your output format:</h3>
            <Form.Select className="type-selector" onChange={handleFormatChange} value={selectedFormat}>
              <option value="html">HTML</option>
            </Form.Select>
          </Row>
          <Row>
            <Col md={6}>
              <h3>Content Workspace</h3>
              <Editor selectedFormat={selectedFormat} />
            </Col>
            <Col md={6}>
              <h3>Site Analyzer</h3>
              <ArticleForm selectedFormat={selectedFormat} />
            </Col>
          </Row>
        </Container>
        </div>
      </Container>
      <VerticalButtons />
    </>
  );
}
