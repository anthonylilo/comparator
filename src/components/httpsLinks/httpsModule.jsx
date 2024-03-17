import { Alert, ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";

const HttpsModule = ({ linkStatuses }) => {
  return (
    <Alert variant="warning" className="mt-3">
      <Alert.Heading>HTTP STATUS:</Alert.Heading>
      <ListGroup>
        {Object.entries(linkStatuses).map(([url, status], index) => (
          <ListGroup.Item key={index}>
            {url} - Status: {status}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Alert>
  );
};

HttpsModule.propTypes = {
  linkStatuses: PropTypes.object.isRequired,
};

export default HttpsModule;