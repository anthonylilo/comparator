import Form from 'react-bootstrap/Form';

function urlInput() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>URLs</Form.Label>
        <Form.Control type="url" placeholder="Ingresa las urls separadas por coma" />
      </Form.Group>
    </Form>
  );
}

export default urlInput;