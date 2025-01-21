import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";

const CardsImages = ({ image }) => {
  return (
    <Card>
      <Card.Img src={image.src} alt="Card image" />
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
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Title: </strong>
          {image.title}
        </ListGroup.Item>
        <div className="d-flex justify-content-center bg_Color_Line">
          <div className="card_BorderLine"></div>
        </div>
        <ListGroup.Item>
          <strong>Alt Text: </strong>
          {image.alt}
        </ListGroup.Item>
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
  }).isRequired,
};

export default CardsImages;
