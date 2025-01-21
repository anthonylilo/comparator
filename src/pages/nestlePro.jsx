import { Container, Row, Col, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import ArticleForm from "../modules/comparator/articleForm";
import Editor from "../modules/editor/editor";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";
import SubNavbar from "../components/navbar/subNavbar";

export default function Professional(className = "Professional") {
  useEffect(() => {
    document.documentElement.setAttribute("data-project", "professional");
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
          <h1 className="brandBackgroundHeading">Professional</h1>
          <Container className="main" fluid>
            <Row className="text-center pt-4 pb-4">
              <Col md={12}>
                <h3>Select your output format:</h3>
                <Container fluid="md">
                  <Form.Select
                    className="type-selector"
                    onChange={handleFormatChange}
                    value={selectedFormat}
                  >
                    <option value="html">HTML</option>
                    <option value="markdown">Markdown</option>
                  </Form.Select>
                </Container>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h3>Content Workspace</h3>
                <Editor selectedFormat={selectedFormat} projectName={"nestlePro"} />
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
