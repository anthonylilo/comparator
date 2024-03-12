import { Container, Row, Form } from "react-bootstrap";

export default function MainComparator() {
  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Url of the article</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Example textarea</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
        </Form>
      </Row>
    </Container>
  );
}
