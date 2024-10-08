import { Alert, Container, ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import {Table, Row} from "react-bootstrap"

const HttpsModule = ({ linkStatuses }) => {
  return (
    <Container className="mt-3">
      <h3>HTTP STATUS:</h3>
      <Table hover responsive>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(linkStatuses).map(([url, status], index) => (
            <tr key={index}>
              <td>{url}</td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};


HttpsModule.propTypes = {
  linkStatuses: PropTypes.object.isRequired,
};

export default HttpsModule;