import { Card, ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";

const BannerData = ({ image }) => {
  return (
    <Card>
      <Card.Img variant="top" src={image.src} />
      <Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <strong>Size: </strong>
            {image.size}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Dimension: </strong>
            {image.width} x {image.height}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Alt: </strong>
            {image.alt}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Title: </strong>
            {image.title}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Name: </strong>
            {image.imageName}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

BannerData.propTypes = {
  image: PropTypes.object.isRequired,
};

export default BannerData;
