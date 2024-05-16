import { Container, Row, Col, Button } from "react-bootstrap";
import ArticleForm from "../components/comparator/articleForm";
import Editor from "../components/editor/editor";
import Dropdowns from "../components/comparator/dropdowns/dropdowns";

export default function HomePage() {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        <h1>Nestlé SyncBox</h1>
        <Dropdowns />
        <Row className="justify-content-md-center text-center mt-3">
          <a
            className="text-center btn btn-primary"
            href="https://cors-anywhere.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Activar la api :D
          </a>
        </Row>
        <Row className="justify-content-md-center text-center mt-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Row>
        <Col md={6}>
          <h3>Editor</h3>
          <Editor />
        </Col>
        <Col md={6}>
          <h3>Comparador</h3>
          <ArticleForm />
        </Col>
      </Row>
    </Container>
  );
}
