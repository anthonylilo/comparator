import { Container, Row, Col } from 'react-bootstrap'
import ArticleForm from '../components/comparator/articleForm'
import EditorTest from '../components/editor/editor'
import Dropdowns from '../components/comparator/dropdowns/dropdowns';
import Desplegables from '../components/comparator/desplegables/desplegables';

export default function HomePage() {
  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
      <h1>Nestlé SyncBox</h1>
        <Col md={6}>
          <h3>Editor</h3>
          <Dropdowns/>
          <EditorTest/>
          <Desplegables />
        <input type="radio" name="projectSelector" id="Purina" />
        <label htmlFor="Purina">Purina</label>
        <input type="radio" name="projectSelector" id="babyAndMe" />
        <label htmlFor="babyAndMe">Baby and me</label>
        <input type="radio" name="projectSelector" id="NP" />
        <label htmlFor="NP">Nestlé Proffesional</label>
        </Col>
        <Col md={6}>
          <h3>Comparador</h3>
          <ArticleForm/>
        </Col>
      </Row>
    </Container>
  );
}