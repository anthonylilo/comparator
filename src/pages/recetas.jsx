import { Container, Row, Col, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import ArticleForm from "../modules/comparator/articleForm";
import Editor from "../modules/editor/editor";
import HomeNavbar from "../components/navbar/homeNavbar";
import VerticalButtons from "../components/navigatonButtons/verticalButtons";
import SubNavbar from "../components/navbar/subNavbar";
import DataLayerCrawler from "../components/recetasCrawler/dataLayerCrawler";

export default function Recetas(className = "Recetas") {
  useEffect(() => {
    document.documentElement.setAttribute("data-project", "recetas");
  }, []);
  const [selectedFormat, setSelectedFormat] = useState("html");

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container>
        <div className="containerWrapper">
          <h1 className="brandBackgroundHeading">Recetas Nestlé</h1>
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
                  </Form.Select>
                </Container>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <h3>Content Workspace</h3>
                <Editor selectedFormat={selectedFormat} projectName={"Recetas"}/>
              </Col>
              <Col md={6}>
                <h3>Site Analyzer</h3>
                <ArticleForm selectedFormat={selectedFormat} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
              <h3>SRH get</h3>
              <DataLayerCrawler/>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
      <VerticalButtons />
    </>
  );
}
