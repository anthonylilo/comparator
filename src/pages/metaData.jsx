import { Container, Row, Form, Button, ProgressBar } from "react-bootstrap";
import HomeNavbar from "../components/navbar/homeNavbar";
import SubNavbar from "../components/navbar/subNavbar";
import MetaData from "../components/metaData/metaData";
import { useState, useEffect } from "react";
import handleSubmitLogic from "../services/handleSubmitLogic";

export default function MetaDataPage({ reset }) {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState({});
  const [h1Tags, setH1Tags] = useState([]);
  const [urlStatuses, setUrlStatuses] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const urlList = urls
      .split("\n") // Dividir por línea
      .map((url) => url.trim())
      .filter((url) => url); // Eliminar líneas vacías

    for (const url of urlList) {
      if (url) {
        await handleSubmitLogic(
          url,
          "", // No estamos usando redirectUrls aquí
          setUrls,
          setLoading,
          () => {}, // setInvalidLinks (no usado)
          () => {}, // setLinkStatuses (no usado)
          () => {}, // setSchema (omitido)
          () => {}, // setShowAdditionalFields (no usado)
          (title) => setMetaData((prev) => ({ ...prev, title })), // Almacenar título en metaData
          (metaDescription) =>
            setMetaData((prev) => ({ ...prev, metaDescription })), // Almacenar metaDescription
          () => {}, // setBanner (no usado)
          () => {}, // setArticleContent (no usado)
          () => {}, // setRedirectStatuses (no usado)
          (articleTitle) => setMetaData((prev) => ({ ...prev, articleTitle })), // Almacenar articleTitle
          setH1Tags // Almacenar H1 tags
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
            <MetaData metaData={metaData} />
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
