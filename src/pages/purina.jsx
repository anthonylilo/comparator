import { Container, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import ArticleForm from "../modules/comparator/articleForm";
import Editor from "../modules/editor/editor";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";
import SubNavbar from "../components/navbar/subNavbar";

export default function Purina() {
  useEffect(() => {
    document.documentElement.setAttribute("data-project", "purina");
  }, []);
  const [selectedFormat, setSelectedFormat] = useState("markdown");

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container>
        <div className="containerWrapper">
          <h1 className="brandBackgroundHeading">Purina</h1>
          <Container className="main" fluid>
            <Row className="text-center pt-4 pb-4">
              <h3>Select your output format:</h3>
              <Form.Select onChange={handleFormatChange} value={selectedFormat}>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </Form.Select>
            </Row>
            <Row>
              <Col md={6}>
                <h3>Editor</h3>
                <Editor selectedFormat={selectedFormat} projectName={"purina"} />
              </Col>
              <Col md={6}>
                <h3>Comparator</h3>
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
