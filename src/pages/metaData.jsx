import { Container, Row, Form, Button, ProgressBar } from "react-bootstrap";
import HomeNavbar from "../components/navbar/homeNavbar";
import SubNavbar from "../components/navbar/subNavbar";
import SchemaViewer from "../components/schema/SchemaViewer";
import MetaData from "../components/metaData/metaData";
import { useState, useEffect } from "react";
import handleSubmitLogic from "../services/handleSubmitLogic";

export default function MetaDataPage({ reset }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState(null);
  const [metaDescription, setMetaDescription] = useState("");
  const [title, setTitle] = useState("");

  const metaData = {
    title: title,
    metaDescription: metaDescription,
    suggestedUrl: url,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmitLogic(
        url,
        "",
        setUrl,
        setLoading,
        () => {}, // setInvalidLinks (no usado)
        () => {}, // setLinkStatuses (no usado)
        setSchema,
        () => {}, // setShowAdditionalFields (no usado)
        setTitle,
        setMetaDescription,
        () => {}, // setBanner (no usado)
        () => {}, // setArticleContent (no usado)
        () => {}, // setRedirectStatuses (no usado)
        () => {} // setArticleTitle (no usado)
      );
    } catch (error) {
      console.error("Error fetching metadata and schema:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reset) {
      setUrl("");
      setSchema(null);
      setMetaDescription("");
      setTitle("");
    }
  }, [reset]);

  return (
    <>
      <HomeNavbar />
      <SubNavbar />
      <Container fluid="md">
        <h1>MetaData Checker</h1>
        <Row className="justify-content-md-center text-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group
              className="mb-3 mt-3"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Control
                type="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
        {schema && (
          <Row className="mt-3">
            <SchemaViewer schema={schema} />
          </Row>
        )}
      </Container>
    </>
  );
}
