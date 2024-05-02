import Form from 'react-bootstrap/Form';

//TODO: Cambiar a props para hacer uso de este componente

function InputText() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>URLs</Form.Label>
        <Form.Control type="url" placeholder="Ingresa las urls separadas por coma" />
      </Form.Group>
    </Form>
  );
}

export default InputText;