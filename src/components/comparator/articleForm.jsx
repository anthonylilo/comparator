import {
  Container,
  Row,
  Form,
  Button,
  Col,
  ProgressBar,
} from "react-bootstrap";
import { useState } from "react"; // Importa useState
import { useArticleFormHooks } from "./hooks/useArticleFormHooks";
import handleSubmitLogic from "./utils/handleSubmitLogic";
import RichEditor from "../general/ckeditor";
import BannerData from "./banner/bannerData";
import CardsImages from "./cards/cardsImages";
import InvalidLinksComponent from "./invalidLinks/invalidLinks";
import HttpsModule from "./httpsLinks/httpsModule";
import SchemaViewer from "./schema/SchemaViewer";
import MetaData from "./metaData/metaData";

function ArticleForm() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSubmitLogic(
      url,
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
      setArticleContent
    );
  };

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
        </>
      )}
    </Container>
  );
}

export default ArticleForm;
