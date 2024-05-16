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
import RichEditor from "../general/ckeditor";
import BannerData from "./banner/bannerData";
import CardsImages from "./cards/cardsImages";
import InvalidLinksComponent from "./invalidLinks/invalidLinks";
import HttpsModule from "./httpsLinks/httpsModule";
import SchemaViewer from "./schema/SchemaViewer";
import MetaData from "./metaData/metaData";
import RedirectStatusesComponent from "./redirectStatus/redirectStatuseComponent";

function ArticleForm({ reset }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSubmitLogic(
      url,
      redirectUrls,
      setUrl,
      setLoading,
      setImageUrls,
      setInvalidLinks,
      setLinkStatuses,
      setSchema,
      setShowAdditionalFields,
      setTitle,
      setMetaDescription,
      setBanner,
      setArticleContent,
      setRedirectStatuses // Passing the state setter for redirect statuses
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
      setArticleContent("");
      setRedirectStatuses({});
    }
  }, [reset]);

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Url of the article</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter article URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label>URLs for Redirection Validation</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa las urls separadas por coma"
              value={redirectUrls}
              onChange={(e) => setRedirectUrls(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
          {loading && <ProgressBar animated now={100} className="mt-2" />}
        </Form>
      </Row>
      {showAdditionalFields && (
        <>
          <Row className="mt-3">
            <Col>
              <MetaData
                title={title}
                metaDescription={metaDescription}
                url={url}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <h3>Article Content</h3>
            <RichEditor articleContent={articleContent} />{" "}
          </Row>
          <Row className="mt-3">
            <BannerData image={banner} />
          </Row>
          <Row className="mt-3">
            {imageUrls.map((image, index) => (
              <Col key={index} md={6} className="mb-3">
                <CardsImages image={image} />
              </Col>
            ))}
          </Row>
          {invalidLinks.length > 0 && (
            <InvalidLinksComponent invalidLinks={invalidLinks} />
          )}
          <Row className="mt-3">
            <HttpsModule linkStatuses={linkStatuses} />
          </Row>
          {schema && <SchemaViewer schema={schema} />}
          <Row className="mt-3">
            <RedirectStatusesComponent redirectStatuses={redirectStatuses} />
          </Row>
        </>
      )}
    </Container>
  );
}

export default ArticleForm;
