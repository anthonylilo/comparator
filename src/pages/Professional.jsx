import { Container, Row, Col, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import ArticleForm from "./ArticleForm";
import Editor from "./Editor";
import HomeNavbar from "../components/navbar/HomeNavbar";
import VerticalButtons from "../components/navigatonButtons/VerticalButtons";
import SubNavbar from "../components/navbar/SubNavbar";
import CountrySelect from "../components/countrySelect/CountrySelect";
import { CountryProvider } from "../services/CountryContext";

export default function Professional() {
  useEffect(() => {
    document.documentElement.setAttribute("data-project", "professional");
  }, []);
  const [selectedFormat, setSelectedFormat] = useState("html");

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  return (
    <CountryProvider>
      <HomeNavbar />
      <SubNavbar />
      <Container>
        <div className="containerWrapper">
          <h1 className="brandBackgroundHeading">Professional</h1>
          <Container className="main" fluid>
            <Row className="text-center pt-4 pb-4">
              <Col md={6}>
                <h3>Select your output format:</h3>
                <Container fluid="md">
                  <Form.Select
                    className="type-selector"
                    onChange={handleFormatChange}
                    value={selectedFormat}
                  >
                    <option value="html">HTML</option>
                  </Form.Select>
                </Container>
              </Col>
              <Col md={6}>
                <CountrySelect></CountrySelect>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h3>Content Workspace</h3>
                <Editor
                  selectedFormat={selectedFormat}
                  projectName={"Professional"}
                />
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
    </CountryProvider>
  );
}
