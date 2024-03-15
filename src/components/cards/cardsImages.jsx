import { Card, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CardsImages = ({ image }) => {
  return (
    <Card>
      <Card.Img variant="top" src={image.src} />
      <Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <strong>Title: </strong>
            {image.title}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Alt: </strong>
            {image.alt}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

CardsImages.propTypes = {
  image: PropTypes.object.isRequired,
};

export default CardsImages;