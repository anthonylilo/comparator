import {
  Container,
  Row,
  Form,
  Button,
  Col,
  ProgressBar,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useArticleFormHooks } from "./hooks/useArticleFormHooks";
import handleSubmitLogic from "../../services/handleSubmitLogic";
import CardsImages from "../../components/cards/cardsImages";
import InvalidLinksComponent from "../../components/invalidLinks/invalidLinks";
import HttpsModule from "../../components/httpsLinks/httpsModule";
import SchemaViewer from "../../components/schema/SchemaViewer";
import MetaData from "../../components/metaData/metaData";
import RedirectStatusesComponent from "../../components/redirectStatus/redirectStatuseComponent";

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
  const metaData = {
    title: title,
    metaDescription: metaDescription,
    suggestedUrl: url,
  };

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

  const placeHolderOption = window.location.pathname;

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        {!showAdditionalFields && (
          <Form onSubmit={handleSubmit}>
            <Form.Group
              className="mb-3 mt-3"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Control
                type="url"
                placeholder={
                  placeHolderOption === "/comparator"
                    ? "https://purina.cl/"
                    : placeHolderOption === "/comparator/nutrition"
                    ? "https://www.babyandme.com"
                    : "https://nestleprofessional-latam.com/pais/"
                }
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
        )}
      </Row>
      {showAdditionalFields && (
        <Row className="mt-3">
          <div id="comparator">
            <h1>{articleTitle}</h1>
            {banner && <CardsImages image={banner} />}
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
            <MetaData metaData={metaData} />
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
        </Row>
      )}
    </Container>
  );
}

export default ArticleForm;
