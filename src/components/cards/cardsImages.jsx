import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

const CardsImages = ({ image, compare, compareIndex }) => {
  const isPlaceholder = image?.src === "/images/no-image.png";

  // If compare is not passed, resolve it from localStorage using compareIndex
  let resolvedCompare = compare;

  try {
    const active = localStorage.getItem("imageCompareActive") === "1";
    const report = JSON.parse(
      localStorage.getItem("imageCompareReport") || "null",
    );

    if (!resolvedCompare && active && report?.rows && compareIndex != null) {
      // compareIndex is 1-based, and report.rows use index: i+1
      resolvedCompare =
        report.rows.find((r) => r.index === compareIndex) || null;
    }
  } catch {
    // ignore localStorage failures
  }

  return (
    <Card>
      <Card.Img src={image.src} alt={image.alt || "Image"} />

      <Card.ImgOverlay className="text-white">
        <div className="d-flex justify-content-between">
          {image.size && (
            <Card.Title className="card_Background_Color card_Image_Size">
              {image.size}
            </Card.Title>
          )}
          {image.width && image.height && (
            <Card.Title className="card_Background_Color card_Image_Dimension">
              {image.width} x {image.height}
            </Card.Title>
          )}
        </div>
      </Card.ImgOverlay>
      <ListGroup className="list-group-flush text-center">
        <ListGroup.Item className="text-white card_Background_Color card_Name_Image">
          {image.imageName}

          {resolvedCompare?.checks?.imageName != null && (
            <Badge
              className="ms-2"
              bg={resolvedCompare.checks.imageName ? "success" : "danger"}
            >
              {resolvedCompare.checks.imageName ? "OK" : "DIFF"}
            </Badge>
          )}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Alt Text: </strong>
          {image.alt}

          {resolvedCompare?.checks?.alt != null && (
            <Badge
              className="ms-2"
              bg={resolvedCompare.checks.alt ? "success" : "danger"}
            >
              {resolvedCompare.checks.alt ? "OK" : "DIFF"}
            </Badge>
          )}
        </ListGroup.Item>
        <div className="d-flex justify-content-center bg_Color_Line">
          <div className="card_BorderLine"></div>
        </div>
        <ListGroup.Item>
          <strong>Title: </strong>
          {image.title}

          {resolvedCompare?.checks?.title != null && (
            <Badge
              className="ms-2"
              bg={resolvedCompare.checks.title ? "success" : "danger"}
            >
              {resolvedCompare.checks.title ? "OK" : "DIFF"}
            </Badge>
          )}
        </ListGroup.Item>

        {isPlaceholder && image.urlActual && (
          <>
            <div className="d-flex justify-content-center bg_Color_Line">
              <div className="card_BorderLine"></div>
            </div>
            <ListGroup.Item>
              <strong>Current URL (download): </strong>
              <a href={image.urlActual} target="_blank" rel="noreferrer">
                {image.urlActual}
              </a>
            </ListGroup.Item>
          </>
        )}
      </ListGroup>
    </Card>
  );
};

CardsImages.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    size: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    imageName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    urlActual: PropTypes.string,
    urlSuggested: PropTypes.string,
  }).isRequired,
  compare: PropTypes.object,
  compareIndex: PropTypes.number,
};

export default CardsImages;
