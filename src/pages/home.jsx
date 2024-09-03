import { Container, Row, Col, Form } from "react-bootstrap";
import { useState } from "react";
import ArticleForm from "../modules/comparator/articleForm";
import Editor from "../modules/editor/editor";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";

export default function HomePage({dark}) {
  const [selectedFormat, setSelectedFormat] = useState("markdown");

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  return (
    <>
      <HomeNavbar />
      <Container>
        <Container className="main" fluid>
          <Row className="text-center">
            <h3>Select your output format:</h3>
            <Form.Select onChange={handleFormatChange} value={selectedFormat}>
              <option value="markdown">Markdown</option>
              { /* <option value="html">HTML</option> */ }
            </Form.Select>
          </Row>
          <Row>
            <Col md={6}>
              <h3>Editor</h3>
              <Editor selectedFormat={selectedFormat} />
            </Col>
            <Col md={6}>
              <h3>Comparator</h3>
              <ArticleForm selectedFormat={selectedFormat} />
            </Col>
          </Row>
        </Container>
      </Container>
      <VerticalButtons />
    </>
  );
}
