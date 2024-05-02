import { Container, Row, Col } from 'react-bootstrap'
import ArticleForm from '../components/comparator/articleForm'
import Editor from '../components/editor/editor'
import Dropdowns from '../components/comparator/dropdowns/dropdowns';

export default function HomePage() {
  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
      <h1>Nestlé SyncBox</h1>
          <Dropdowns/>
        <Col md={6}>
          <h3>Editor</h3>
          <Editor/>
        </Col>
        <Col md={6}>
          <h3>Comparador</h3>
          <ArticleForm/>
        </Col>
      </Row>
    </Container>
  );
}