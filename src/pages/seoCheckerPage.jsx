import { Container, Row, Form, Button, ProgressBar } from "react-bootstrap";
import HomeNavbar from "../components/navbar/HomeNavbar";
import SubNavbar from "../components/navbar/SubNavbar";
import SeoChecker from "../components/metaData/SeoChecker";
import React, { useState, useEffect } from "react";
import HandleSubmitLogic from "../services/HandleSubmitLogic";

export default function SeoCheckerPage({ reset }) {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState({});
  const [h1Tags, setH1Tags] = useState([]);
  const [urlStatuses, setUrlStatuses] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const urlList = urls
      .split("\n") // Split by line breaks
      .map((url) => url.trim())
      .filter((url) => url); // Remove empty lines

    for (const url of urlList) {
      if (url) {
        await HandleSubmitLogic(
          url,
          "", // Not using redirectUrls here
          setUrls,
          setLoading,
          () => {}, // setInvalidLinks (not used)
          () => {}, // setLinkStatuses (not used)
          () => {}, // setSchema (omitted)
          () => {}, // setShowAdditionalFields (not used)
          (title) => setMetaData((prev) => ({ ...prev, title })), // Store title in metaData
          (metaDescription) =>
            setMetaData((prev) => ({ ...prev, metaDescription })), // Store metaDescription in metaData
          () => {}, // setBanner (not used)
          () => {}, // setArticleContent (not used)
          () => {}, // setRedirectStatuses (not used)
          (articleTitle) => setMetaData((prev) => ({ ...prev, articleTitle })), // Store articleTitle in metaData
          setH1Tags, // Store H1 tags
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (reset) {
      setUrls("");
      setMetaData({});
      setH1Tags([]);
      setUrlStatuses({});
    }
  }, [reset]);

  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container fluid="md">
        <h1>SEO Checker</h1>
        <Row className="justify-content-md-center text-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group
              className="mb-3 mt-3"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Enter URLs, one per line"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
            {loading && (
              <ProgressBar
                variant="success"
                animated
                now={100}
                className="mt-2"
              />
            )}
          </Form>
        </Row>
        {metaData.title && metaData.metaDescription && (
          <Row className="mt-3">
            <SeoChecker metaData={metaData} />
          </Row>
        )}
        {h1Tags.length > 0 && (
          <Row className="mt-3">
            <h2>H1 Tags:</h2>
            <ul>
              {h1Tags.map((h1, index) => (
                <li key={index}>{h1}</li>
              ))}
            </ul>
          </Row>
        )}
        {Object.keys(urlStatuses).length > 0 && (
          <Row className="mt-3">
            <h2>URL Statuses:</h2>
            <ul>
              {Object.entries(urlStatuses).map(([url, status], index) => (
                <li key={index}>
                  {url}: {status}
                </li>
              ))}
            </ul>
          </Row>
        )}
      </Container>
    </>
  );
}
