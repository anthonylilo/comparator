import { Alert, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const InvalidLinksComponent = ({ invalidLinks }) => {
  return (
    <Alert variant="danger" className="mt-3">
      <Alert.Heading>Different domains, please check:</Alert.Heading>
      <ListGroup>
        {invalidLinks.map((link, index) => (
          <ListGroup.Item key={index}>{link}</ListGroup.Item>
        ))}
      </ListGroup>
    </Alert>
  );
};

InvalidLinksComponent.propTypes = {
  invalidLinks: PropTypes.array.isRequired,
};

export default InvalidLinksComponent;