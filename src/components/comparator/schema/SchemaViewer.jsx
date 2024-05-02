import { Row, Form, Col } from "react-bootstrap";
import PropTypes from "prop-types";

function SchemaViewer({ schema }) {
  return (
    <Row className="mt-3 mb-3">
      <Form.Group as={Col} controlId="exampleForm.ControlInput2">
        <Form.Label>Schema</Form.Label>
        <input
          type="text"
          className="form-control"
          value={JSON.stringify(schema)}
          readOnly
        />
      </Form.Group>
    </Row>
  );
}

SchemaViewer.propTypes = {
  schema: PropTypes.object.isRequired,
};

export default SchemaViewer;
