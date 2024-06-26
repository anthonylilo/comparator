import {
  Container,
  Row,
  Form,
  Button,
  Col,
  ProgressBar,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useArticleFormHooks } from "./hooks/useArticleFormHooks";
import handleSubmitLogic from "./utils/handleSubmitLogic";
import CardsImages from "../../components/cards/cardsImages";
import InvalidLinksComponent from "./invalidLinks/invalidLinks";
import HttpsModule from "./httpsLinks/httpsModule";
import SchemaViewer from "../../components/schema/SchemaViewer";
import MetaData from "./metaData/metaData";
import RedirectStatusesComponent from "./redirectStatus/redirectStatuseComponent";

function ArticleForm({ reset, selectedFormat }) {
  const {
    url,
    setUrl,
    imageUrls,
    setImageUrls,
    invalidLinks,
    setInvalidLinks,
    linkStatuses,
    setLinkStatuses,
    schema,
    setSchema,
    loading,
    setLoading,
    showAdditionalFields,
    setShowAdditionalFields,
    title,
    setTitle,
    metaDescription,
    setMetaDescription,
    banner,
    setBanner,
    articleContent,
    setArticleContent,
  } = useArticleFormHooks();

  const [redirectUrls, setRedirectUrls] = useState("");
  const [redirectStatuses, setRedirectStatuses] = useState({});
  const [articleTitle, setArticleTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitLogic(
      url,
      redirectUrls,
      setUrl,
      setLoading,
      setInvalidLinks,
      setLinkStatuses,
      setSchema,
      setShowAdditionalFields,
      setTitle,
      setMetaDescription,
      setBanner,
      setArticleContent,
      setRedirectStatuses,
      setArticleTitle
    );
  };

  useEffect(() => {
    if (reset) {
      setUrl("");
      setRedirectUrls("");
      setLoading(false);
      setImageUrls([]);
      setInvalidLinks([]);
      setLinkStatuses({});
      setSchema(null);
      setShowAdditionalFields(false);
      setTitle("");
      setMetaDescription("");
      setBanner(null);
      setArticleContent([]);
      setArticleTitle("");
      setRedirectStatuses({});
    }
  }, [reset]);

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        {!showAdditionalFields && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Article URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://purina.cl/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Redirect URLs</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={redirectUrls}
                onChange={(e) => setRedirectUrls(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
            {loading && <ProgressBar animated now={100} className="mt-2" />}
          </Form>
        )}
      </Row>
      {showAdditionalFields && (
        <>
          <div id="comparator">
            <Row className="mt-3">
              <h1>{articleTitle}</h1>
            </Row>
            {banner && (
              <Row className="mt-3">
                <Col md={12} className="mb-3">
                  <CardsImages image={banner} />
                </Col>
              </Row>
            )}
            <Row className="mt-3">
              {articleContent.map((item, index) => (
                <Col key={index} md={12} className="mb-3">
                  {item.type === "html" && (
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  )}
                  {item.type === "image" && <CardsImages image={item} />}
                </Col>
              ))}
            </Row>
          </div>
          <Row className="mt-3">
            <MetaData
              title={title}
              metaDescription={metaDescription}
              url={url}
            />
          </Row>
          {schema && <SchemaViewer schema={schema} />}
          {invalidLinks.length > 0 && (
            <InvalidLinksComponent invalidLinks={invalidLinks} />
          )}
          <Row className="mt-3">
            <HttpsModule linkStatuses={linkStatuses} />
          </Row>
          {redirectStatuses.length > 0 && (
            <Row className="mt-3">
              <RedirectStatusesComponent redirectStatuses={redirectStatuses} />
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default ArticleForm;
