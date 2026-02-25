import {
  Container,
  Row,
  Form,
  Button,
  Col,
  ProgressBar,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useArticleFormHooks } from "../services/UseArticleFormHooks";
import HandleSubmitLogic from "../services/HandleSubmitLogic";
import { ProjectSettings } from "../services/settings/ProjectSettings";
import ModalLoading from "../components/modal/ModalLoading";
import CardsImages from "../components/cards/CardsImages";
import InvalidLinks from "../components/invalidLinks/InvalidLinks";
import HttpsModule from "../components/httpsLinks/HttpsModule";
import SchemaViewer from "../components/schema/SchemaViewer";
import MetaData from "../components/metaData/SeoChecker";
import RedirectStatusesComponent from "../components/redirectStatus/RedirectStatusComponent";

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
    metaRobots,
    setMetaRobots,
    metaKeyWords,
    setMetaKeyWords,
    metaGeoRegion,
    setMetaGeoRegion,
    metaGeoPlacename,
    setMetaGeoPlacename,
    banner,
    setBanner,
    articleContent,
    setArticleContent,
    headingTitle,
    setHeadingTitle,
    descriptionIntro,
    setDescriptionIntro,
    brandSelected,
    setBrandSelected,
    category,
    setCategory,
  } = useArticleFormHooks();

  const [redirectUrls, setRedirectUrls] = useState("");
  const [redirectStatuses, setRedirectStatuses] = useState({});
  const [articleTitle, setArticleTitle] = useState("");
  const metaData = {
    title: title,
    metaDescription: metaDescription,
    suggestedUrl: url,
    metaRobots: metaRobots,
    metaKeyWords: metaKeyWords,
    metaGeoRegion: metaGeoRegion,
    metaGeoPlacename: metaGeoPlacename,
    h1Title: headingTitle,
    descriptionIntro: descriptionIntro,
    brandSelected: brandSelected,
    category: category,
  };
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const settings = ProjectSettings();

  useEffect(() => {
    if (settings?.config?.crawler === "notReady") {
      setModalText("The crawler is not ready yet, we're working on it.");
      setShowModal(true);
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await HandleSubmitLogic(
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
      setMetaRobots,
      setMetaKeyWords,
      setMetaGeoRegion,
      setMetaGeoPlacename,
      setBanner,
      setArticleContent,
      setRedirectStatuses,
      setArticleTitle,
      setHeadingTitle,
      setModalText,
      setShowModal,
      setDescriptionIntro,
      setBrandSelected,
      setCategory,
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
      (setMetaRobots(""),
        setMetaKeyWords(""),
        setMetaGeoRegion(""),
        setMetaGeoPlacename(""),
        setBanner(null));
      setArticleContent([]);
      setArticleTitle("");
      setRedirectStatuses({});
      setCategory("");
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
                  placeHolderOption === "/NSB/comparator/purina"
                    ? "https://purina.cl/"
                    : placeHolderOption === "/NSB/comparator/nutrition"
                      ? "https://www.babyandme.com"
                      : placeHolderOption === "/NSB/comparator/professional"
                        ? "https://nestleprofessional-latam.com/pais/"
                        : placeHolderOption === "/NSB/comparator/recetas"
                          ? "https://recetasnestle.com/"
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
            <h1>{headingTitle}</h1>
            {banner && (
              <CardsImages image={banner} compareIndex={1} compareSide="site" />
            )}
            <Row className="mt-3">
              {(() => {
                // imagePos is 1-based; banner already used position 1
                let imagePos = banner ? 1 : 0;
                return articleContent.map((item, index) => {
                  // Increase counter ONLY for images
                  if (item?.type === "image") imagePos += 1;
                  return (
                    <Col key={index} md={12} className="mb-3">
                      {item.type === "html" && (
                        <div
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      )}

                      {item.type === "image" && (
                        <CardsImages
                          image={item}
                          compareIndex={imagePos}
                          compareSide="site"
                        />
                      )}
                    </Col>
                  );
                });
              })()}
            </Row>
          </div>
          <Row className="mt-3">
            <MetaData metaData={metaData} />
          </Row>
          {schema && <SchemaViewer schema={schema} />}
          {invalidLinks.length > 0 && (
            <InvalidLinks invalidLinks={invalidLinks} />
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
      <ModalLoading
        text={modalText}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </Container>
  );
}

export default ArticleForm;
